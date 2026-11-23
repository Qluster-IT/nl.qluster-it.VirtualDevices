'use strict';

const http = require('http');
const https = require('https');
const { Readable, Transform, pipeline: streamPipeline } = require('stream');
const { promisify } = require('util');
const pipeline = promisify(streamPipeline);

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const CAMERA_CLASSES = ['camera', 'doorbell'];

function imageUrl(value, allowEmpty = false, invalidMessage = 'Invalid image URL') {
  if (typeof value !== 'string') throw new Error(invalidMessage);
  const text = value.trim();
  if (!text && allowEmpty) return '';
  let url;
  try { url = new URL(text); } catch { throw new Error(invalidMessage); }
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error(invalidMessage);
  return url.href;
}

function videoUrl(value, allowEmpty = false) {
  if (typeof value !== 'string') throw new Error('Invalid video URL');
  const text = value.trim();
  if (!text && allowEmpty) return '';
  let url;
  try { url = new URL(text); } catch { throw new Error('Invalid video URL'); }
  if (!['http:', 'https:', 'rtsp:', 'rtmp:'].includes(url.protocol)) throw new Error('Invalid video URL');
  return url.href;
}

function supportsVideo(homey) {
  if (homey.platform === 'cloud') return !!homey.videos;
  const parts = String(homey.version).split('.').map(Number);
  return !!homey.videos && (parts[0] > 12 || (parts[0] === 12 && parts[1] >= 7))
    && homey.platformVersion !== 1;
}

function limitStream() {
  let size = 0;
  return new Transform({
    transform(chunk, encoding, callback) {
      size += chunk.length;
      callback(size > MAX_IMAGE_SIZE ? new Error('Image exceeds 5 MB') : null, chunk);
    },
  });
}

function getResponse(source, redirects = 0) {
  return new Promise((resolve, reject) => {
    const url = new URL(imageUrl(source));
    const request = (url.protocol === 'https:' ? https : http).get(url, response => {
      if ([301, 302, 303, 307, 308].includes(response.statusCode) && response.headers.location) {
        response.resume();
        if (redirects >= 5) return reject(new Error('Too many image redirects'));
        let next;
        try { next = imageUrl(new URL(response.headers.location, url).href); }
        catch { return reject(new Error('Invalid image redirect')); }
        return resolve(getResponse(next, redirects + 1));
      }
      if (response.statusCode < 200 || response.statusCode >= 300) {
        response.resume();
        return reject(new Error(`Image request failed (${response.statusCode})`));
      }
      resolve(response);
    });
    request.setTimeout(15000, () => request.destroy(new Error('Image request timed out')));
    request.on('error', () => reject(new Error('Could not download image')));
  });
}

async function copyToken(image) {
  if (!image || typeof image.getStream !== 'function') throw new Error('An image token is required');
  const stream = await image.getStream();
  const chunks = [];
  let size = 0;
  for await (const chunk of stream) {
    size += chunk.length;
    if (size > MAX_IMAGE_SIZE) {
      stream.destroy();
      const error = new Error('Image exceeds 5 MB');
      error.code = 'IMAGE_TOO_LARGE';
      throw error;
    }
    chunks.push(chunk);
  }
  if (!size) {
    const error = new Error('Image is empty');
    error.code = 'IMAGE_EMPTY';
    throw error;
  }
  return { data: Buffer.concat(chunks).toString('base64'), contentType: (stream.meta && stream.meta.contentType) || stream.contentType || 'image/jpeg' };
}

function videoFactory(homey, source) {
  const url = new URL(source);
  if (url.protocol === 'rtsp:') return homey.videos.createVideoRTSP();
  if (url.protocol === 'rtmp:') return homey.videos.createVideoRTMP();
  if (/\.m3u8$/i.test(url.pathname)) return homey.videos.createVideoHLS();
  if (/\.mpd$/i.test(url.pathname)) return homey.videos.createVideoDASH();
  return homey.videos.createVideoOther();
}

module.exports = { CAMERA_CLASSES, imageUrl, videoUrl, supportsVideo, limitStream, getResponse, copyToken, videoFactory, Readable, pipeline };
