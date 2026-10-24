// Uses the same color functions and time-of-day keyframes as the homepage.
(() => {
class DayxColors {
  rgb(x) { return [parseInt(x.slice(1, 3), 16), parseInt(x.slice(3, 5), 16), parseInt(x.slice(5, 7), 16)]; }
  hex(c) { return '#' + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join(''); }
  lum(c) {
    const l = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
  }
  table(name) {
    if (!this._T) {
      const raw = {
        B: [[0, '#0B0D14'], [4.25, '#10162A'], [5.5, '#2E2A47'], [6.5, '#EBCFC2'], [8.5, '#F2EFE7'], [13, '#F7F6F2'], [16.5, '#F0E5D3'], [17.75, '#EDB98A'], [18.75, '#5A2A2C'], [20, '#1C1A2C'], [22, '#0E1018'], [24, '#0B0D14']],
        A: [[0, '#F2B85B'], [4.25, '#9FB4FF'], [5.5, '#FF9C86'], [6.5, '#C2402A'], [8.5, '#E2471B'], [13, '#E2471B'], [16.5, '#D2470F'], [17.75, '#9E2B14'], [18.75, '#FFB067'], [20, '#FFB067'], [22, '#F2B85B'], [24, '#F2B85B']],
        Z: [[0, '#04050A'], [4.25, '#0A1024'], [5.5, '#2A2850'], [6.5, '#B9B6D8'], [8.5, '#A9C8E6'], [13, '#9CC2E8'], [16.5, '#AFC6DE'], [17.75, '#7C86B8'], [18.75, '#2C2650'], [20, '#121327'], [22, '#070910'], [24, '#04050A']],
        G: [[0, '#1B2A55'], [4.25, '#2B3C78'], [5.5, '#FF8C6B'], [6.5, '#FFB38F'], [8.5, '#FFF1D6'], [13, '#FFF6E2'], [16.5, '#FFD9A0'], [17.75, '#FF8A3D'], [18.75, '#E2533A'], [20, '#3C2A6B'], [22, '#1B2A55'], [24, '#1B2A55']]
      };
      this._T = {};
      for (const k in raw) this._T[k] = raw[k].map((r) => [r[0], this.rgb(r[1])]);
    }
    return this._T[name];
  }
  lerpK(name, h) {
    const K = this.table(name);
    h = ((h % 24) + 24) % 24;
    let i = 0;
    while (i < K.length - 2 && K[i + 1][0] <= h) i++;
    const a = K[i], b = K[i + 1];
    let t = (h - a[0]) / (b[0] - a[0]);
    t = t * t * (3 - 2 * t);
    return [0, 1, 2].map((j) => Math.round(a[1][j] + (b[1][j] - a[1][j]) * t));
  }
  tok(h) {
    const bg = this.lerpK('B', h), ac = this.lerpK('A', h);
    const dark = this.lum(bg) < 0.2;
    const f = dark ? [244, 240, 232] : [23, 19, 14];
    const ra = (c, al) => 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + al + ')';
    return {
      bg: this.hex(bg), fg: this.hex(f), muted: ra(f, dark ? 0.66 : 0.7), line: ra(f, 0.16), faint: ra(f, 0.04),
      accent: this.hex(ac), onAccent: this.lum(ac) > 0.179 ? '#17130E' : '#FFFFFF',
      bandDay: ra(ac, 0.34), bandNight: ra(f, 0.1), dark: dark,
      hatch: 'repeating-linear-gradient(135deg, ' + ra(f, 0.1) + ' 0px, ' + ra(f, 0.1) + ' 1px, transparent 1px, transparent 12px)'
    };
  }
}
const colors = new DayxColors();
function update() {
 const d=new Date(), t=colors.tok(d.getHours()+d.getMinutes()/60+d.getSeconds()/3600);
 const root=document.documentElement;
 for(const [key,value] of Object.entries({paper:t.bg,ink:t.fg,muted:t.muted,rule:t.line,accent:t.accent})) root.style.setProperty('--'+key,value);
 root.style.colorScheme=t.dark?'dark':'light';
}
update();setInterval(update,60000);
})();
