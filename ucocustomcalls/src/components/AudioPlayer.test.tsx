import { render, screen } from '@testing-library/react';
import { AudioPlayer } from './AudioPlayer';

describe('AudioPlayer', () => {
  it('renders label and audio source', () => {
    render(<AudioPlayer src="/audio/sample.mp3" label="Sample Sound" />);
    expect(screen.getByText(/Sample Sound/i)).toBeInTheDocument();
    const audio = document.querySelector('audio');
    expect(audio).toBeTruthy();
    expect(audio?.querySelector('source')?.getAttribute('src')).toBe('/audio/sample.mp3');
    expect(audio?.querySelector('track')?.getAttribute('src')).toBe('/captions/blank.vtt');
  });
});
