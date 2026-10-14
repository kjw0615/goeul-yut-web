"""Original AI-composed game loop. Optional regeneration: Python + NumPy + SciPy.
No third-party melodies or instrument recordings are used.
"""
from pathlib import Path
import numpy as np
from scipy.io.wavfile import write

SR=22050
BPM=104
BEAT=60/BPM
BARS=24
N=round(BARS*4*BEAT*SR)
mix=np.zeros((N,2),dtype=np.float64)
rng=np.random.default_rng(14102026)
def freq(m):return 440*2**((m-69)/12)
def add(signal,beat,gain=.12,pan=0):
    ids=(round(beat*BEAT*SR)+np.arange(len(signal)))%N
    mix[ids,0]+=signal*gain*np.sqrt((1-pan)/2)
    mix[ids,1]+=signal*gain*np.sqrt((1+pan)/2)
def note(m,duration,kind='pluck'):
    t=np.arange(round(duration*BEAT*SR))/SR
    f=freq(m)
    if kind=='pluck':
        tone=sum(np.sin(2*np.pi*f*k*t+(.05*k))*np.exp(-t*(1.7+k*.8))/k**1.3 for k in range(1,7))
        env=np.minimum(1,t/.008)*np.minimum(1,(t[-1]-t)/.06)
    elif kind=='flute':
        phase=2*np.pi*f*t+.05*np.sin(2*np.pi*5.2*t)
        tone=np.sin(phase)+.13*np.sin(2*phase)+.04*np.sin(3*phase)
        env=np.minimum(1,t/.09)*np.minimum(1,(t[-1]-t)/.18)
    else:
        tone=np.sin(2*np.pi*f*t)+.15*np.sin(2*np.pi*f*2*t)
        env=np.minimum(1,t/.06)*np.minimum(1,(t[-1]-t)/.12)*np.exp(-t*.8)
    return tone*env
# D-major pentatonic; three eight-bar phrases with room for game effects.
A=[[(74,0,1),(78,1,1),(81,2,1.5)],[(83,0,1.5),(81,2,1),(78,3,.8)],[(76,0,1),(78,1,1),(74,2,1.5)],[(73,0,2),(74,2,1.5)],[(78,0,1),(81,1,1),(83,2,1.5)],[(86,0,1.5),(83,2,1),(81,3,.8)],[(78,0,1.5),(76,2,1)],[(74,0,2.5)]]
B=[[(81,0,1),(83,1,1),(86,2,1.5)],[(88,0,1.5),(86,2,1),(83,3,.8)],[(81,0,1),(78,1,1),(76,2,1.5)],[(78,0,2),(81,2,1.5)],[(83,0,1),(81,1,1),(78,2,1.5)],[(76,0,1.5),(78,2,1),(81,3,.8)],[(78,0,1.5),(76,2,1)],[(74,0,2.5)]]
chords=[(50,57,62),(47,54,59),(55,62,67),(57,64,69)]
for bar in range(BARS):
    chord=chords[(bar//2)%4]
    add(note(chord[0],3.8,'bass'),bar*4,.11,0)
    for i in range(8):add(note(chord[i%3]+12,1.1),bar*4+i*.5,.075,-.25 if i%2 else .25)
    for m,at,duration in (B if 8<=bar<16 else A)[bar%8]:add(note(m,duration,'flute'),bar*4+at,.115,.1)
    for beat in [0,2]:
        t=np.arange(int(SR*.23))/SR
        drum=np.sin(2*np.pi*(95*t-90*t*t))*np.exp(-t*20)
        add(drum,bar*4+beat,.075,-.1)
    for beat in [1,2.5,3.5]:
        t=np.arange(int(SR*.08))/SR
        tick=(.7*np.sin(2*np.pi*1050*t)+.2*rng.normal(size=len(t)))*np.exp(-t*85)
        add(tick,bar*4+beat,.035,.3)
# Circular early reflections keep the loop boundary continuous.
dry=mix.copy()
for seconds,gain in [(.083,.10),(.151,.075),(.239,.04)]:mix+=np.roll(dry,round(seconds*SR),axis=0)*gain
mix-=mix.mean(axis=0)
mix=np.tanh(mix*1.1)
mix*=.62/max(np.max(np.abs(mix)),1e-9)
dest=Path(__file__).resolve().parents[1]/'public/assets/audio/goeul-breeze.wav'
dest.parent.mkdir(parents=True,exist_ok=True)
write(dest,SR,(mix*32767).astype(np.int16))
print(f'{dest.name}: {N/SR:.2f}s, stereo, {BPM} BPM, peak {np.max(np.abs(mix)):.2f}')
