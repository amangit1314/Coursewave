import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { videoUrl } = await request.json();

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      );
    }

    if (!process.env.ASSEMBLYAI_API_KEY) {
      return NextResponse.json(
        { error: 'AssemblyAI API key not configured' },
        { status: 500 }
      );
    }

    // Step 1: Submit transcription request
    const submitResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'Authorization': process.env.ASSEMBLYAI_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: videoUrl,
        language_code: 'en_us',
      }),
    });

    if (!submitResponse.ok) {
      const errorData = await submitResponse.json();
      throw new Error(errorData.error || 'Failed to submit transcription request');
    }

    const submitData = await submitResponse.json();
    const transcriptId = submitData.id;

    // Step 2: Poll for results
    let transcriptData;
    let attempts = 0;
    const maxAttempts = 30; // 30 attempts * 6 seconds = 3 minutes max

    while (attempts < maxAttempts) {
      const statusResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: {
          'Authorization': process.env.ASSEMBLYAI_API_KEY,
        },
      });

      if (!statusResponse.ok) {
        throw new Error('Failed to check transcription status');
      }

      transcriptData = await statusResponse.json();

      if (transcriptData.status === 'completed') {
        break;
      } else if (transcriptData.status === 'error') {
        throw new Error(`Transcription failed: ${transcriptData.error}`);
      }

      // Wait 6 seconds before next attempt
      await new Promise(resolve => setTimeout(resolve, 6000));
      attempts++;

    }

    if (transcriptData.status !== 'completed') {
      throw new Error('Transcription timeout - taking longer than expected');
    }

    if (!transcriptData.text || transcriptData.text.trim().length === 0) {
      throw new Error('No transcription generated - audio might be silent or unclear');
    }

    return NextResponse.json({
      success: true,
      transcript: transcriptData.text,
      words: transcriptData.words?.length || 0
    });

  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Transcription failed' },
      { status: 500 }
    );
  }
}