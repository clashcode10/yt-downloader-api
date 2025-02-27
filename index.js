


// const express = require('express');
// const app = express();
// const ytdl = require('ytdl-core');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const { pipeline } = require('stream');
// const { promisify } = require('util');
// const pipelineAsync = promisify(pipeline);
// app.use(bodyParser.json());

// app.use(cors()); // Enable CORS (if needed)

// app.post('/download', async (req, res) => {
//     const { url, resolution } = req.body;
//     if (!ytdl.validateURL(url)) {
//         return res.status(400).json({ error: 'Invalid YouTube URL' });
//     }

//     try {
//         const info = await ytdl.getInfo(url);
//         console.log('info', info.formats);

//         const quality = resolution 

//         // Find the format with the requested resolution
//         const format = ytdl.chooseFormat(info.formats, { quality });
//         if (!format) {
//             return res.status(400).json({ error: 'Requested resolution not available for this video' });
//         }

//         res.setHeader('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`);
        
//         // Stream the video directly to the response stream
//         await pipelineAsync(
//             ytdl(url, { quality: format.itag }),
//             res
//         );

//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Failed to download video' });
//     }
// });
  


// app.post('/info', async (req, res) => {
//     const { url } = req.body;
//     if (!ytdl.validateURL(url)) {
//       return res.status(400).json({ error: 'Invalid YouTube URL' });
//     }
  
//     try {
//       const info = await ytdl.getInfo(url);
//       const formatsWithAudio = info.formats.filter(format => format.hasAudio && format.hasVideo);

//       const selectedFormat = formatsWithAudio.find(format => format.resolution === '2160p' || format.resolution === '4320p');
//       console.log('formatsWithAudio', formatsWithAudio);


//       // const formats =  ytdl.filterFormats(info)
//       // const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
//       const audio_formats = ytdl.filterFormats(info.formats, 'audioonly');
//       const video_formats = ytdl.filterFormats(info.formats, 'video');
//       // res.json({ formats: info.formats });
//       res.json({ audio_formats,video_formats});
//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).json({ error: 'Failed to fetch video information' });
//     }
//   });


//   const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


// File: server.mjs

import express from 'express';
import ytdl from 'ytdl-core';
import bodyParser from 'body-parser';
import cors from 'cors';
import { pipeline } from 'stream';
import { promisify } from 'util';

const app = express();
const pipelineAsync = promisify(pipeline);

app.use(bodyParser.json());
app.use(cors());

app.post('/download', async (req, res) => {
    const { url, resolution } = req.body;
    if (!ytdl.validateURL(url)) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    try {
        const info = await ytdl.getInfo(url);
        console.log('info', info.formats);

        const quality = resolution;

        // Find the format with the requested resolution
        const format = ytdl.chooseFormat(info.formats, { quality });
        if (!format) {
            return res.status(400).json({ error: 'Requested resolution not available for this video' });
        }

        res.setHeader('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`);

        // Stream the video directly to the response stream
        await pipelineAsync(
            ytdl(url, { quality: format.itag }),
            res
        );

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to download video' });
    }
});

app.post('/info', async (req, res) => {
    const { url } = req.body;
    if (!ytdl.validateURL(url)) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    try {
        const info = await ytdl.getInfo(url);
        const formatsWithAudio = info.formats.filter(format => format.hasAudio && format.hasVideo);

        const selectedFormat = formatsWithAudio.find(format => format.resolution === '2160p' || format.resolution === '4320p');
        console.log('formatsWithAudio', formatsWithAudio);

        const audio_formats = ytdl.filterFormats(info.formats, 'audioonly');
        const video_formats = ytdl.filterFormats(info.formats, 'video');

        res.json({ audio_formats, video_formats });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch video information' });
    }
});

app.get('/',(req,res)=>{
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.end(`<p>Hello! Go to item: <a href="${path}">${path}</a></p>`);
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



// import ffmpegPath from 'ffmpeg-static';
// import cp from 'child_process';
// import stream from 'stream';
// import ytdl from "ytdl-core";
// import cors from 'cors'
// import express from 'express'
// const app = express()

// app.use(cors())

// app.post('/test',(req,res)=>{

// const ytmixer = (link, options = {}) => {
//   const result = new stream.PassThrough({ highWaterMark: options.highWaterMark || 1024 * 512 });
//   ytdl.getInfo(link, options).then(info => {
//       let audioStream = ytdl.downloadFromInfo(info, { ...options, quality: 
//   'highestaudio' });
//       let videoStream = ytdl.downloadFromInfo(info, { ...options, quality: 
//   'highestvideo' });
//       // create the ffmpeg process for muxing
//       let ffmpegProcess = cp.spawn(ffmpegPath, [
//           // supress non-crucial messages
//           '-loglevel', '8', '-hide_banner',
//           // input audio and video by pipe
//           '-i', 'pipe:3', '-i', 'pipe:4',
//           // map audio and video correspondingly
//           '-map', '0:a', '-map', '1:v',
//           // no need to change the codec
//           '-c', 'copy',
//           // output mp4 and pipe
//           '-f', 'matroska', 'pipe:5'
//       ], {
//           // no popup window for Windows users
//           windowsHide: true,
//           stdio: [
//               // silence stdin/out, forward stderr,
//               'inherit', 'inherit', 'inherit',
//               // and pipe audio, video, output
//               'pipe', 'pipe', 'pipe'
//           ]
//       });
//       audioStream.pipe(ffmpegProcess.stdio[3]);
//       videoStream.pipe(ffmpegProcess.stdio[4]);
//       ffmpegProcess.stdio[5].pipe(result);
//   });
//   return result;
//   };

//   res.setHeader('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`);
  
  
//   ytmixer('https://youtu.be/WO2b03Zdu4Q?si=yKD8uGSRtAoMraLL').pipe(res);


// })

//   const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// import ffmpegPath from 'ffmpeg-static';
// import cp from 'child_process';
// import stream from 'stream';
// import ytdl from "ytdl-core";
// import cors from 'cors';
// import express from 'express';
// import { pipeline } from 'stream/promises'; // Use `pipeline` from 'stream/promises'
// import fetch from 'node-fetch'; // Import `fetch` for making HTTP requests
// const app = express();

// app.use(cors());

// app.post('/test', async (req, res) => {
//     // const { link } = req.body; // Assuming the link is passed in the request body
//     const link = 'https://youtu.be/WO2b03Zdu4Q?si=yKD8uGSRtAoMraLL'

//     const ytmixer = async (link, options = {}) => {
//         const result = new stream.PassThrough({ highWaterMark: options.highWaterMark || 1024 * 512 });

//         try {
//             const info = await ytdl.getInfo(link, options);
//             const audioStream = ytdl.downloadFromInfo(info, { ...options, quality: 'highestaudio' });
//             const videoStream = ytdl.downloadFromInfo(info, { ...options, quality: 'highestvideo' });

//             const ffmpegProcess = cp.spawn(ffmpegPath, [
//                 '-loglevel', '8', '-hide_banner',
//                 '-i', 'pipe:3', '-i', 'pipe:4',
//                 '-map', '0:a', '-map', '1:v',
//                 '-c', 'copy',
//                 '-f', 'matroska', 'pipe:5'
//             ], {
//                 windowsHide: true,
//                 stdio: ['inherit', 'inherit', 'inherit', 'pipe', 'pipe', 'pipe']
//             });

//             audioStream.pipe(ffmpegProcess.stdio[3]);
//             videoStream.pipe(ffmpegProcess.stdio[4]);
//             ffmpegProcess.stdio[5].pipe(result);
//         } catch (error) {
//             console.error('Error:', error);
//         }
//         return result;
//     };

//     try {
//         const resultStream = await ytmixer(link);
//         // const response = await fetch(link); // Fetch video metadata to extract title
//         // const { title } = await response.json();
//         console.log('resultStream',resultStream);

//         res.setHeader('Content-Disposition', `attachment; filename="videoo.mp4"`);
//         await pipeline(resultStream, res);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Failed to process video' });
//     }
// });

// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
