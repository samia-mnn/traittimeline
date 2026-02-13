import React, {useState, useMemo, useEffect} from 'react'
import Papa from 'papaparse'
import TimelineFlow from './TimelineFlow'

export default function App(){
  const [data, setData] = useState([])
  const [trait, setTrait] = useState('')
  const [theme, setTheme] = useState('')

  // load CSV from public/trait_theme_timeline.csv on mount
  useEffect(()=>{
    const url = '/trait_theme_timeline.csv'
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data.map(r => ({
          trait: r.trait || r.trait_name || r.traitName || r.Trait || r.TraitName || '',
          theme: r.theme || r.theme_name || r.themeName || r.Theme || '',
          date: r.date || r.Date || r.year || r.Year || '',
          image_url: r.image_url || r.image || r.Image || r.imageUrl || '' ,
          title: r.title || r.Title || ''
        }))
        setData(rows)
        const first = rows[0]
        if(first){
          setTrait(first.trait)
          setTheme(first.theme)
        }
      },
      error: (err) => {
        console.error('CSV parse error', err)
        // Store no data and show an inline message via data length check
      }
    })
  }, [])

  const combos = useMemo(()=>{
    const set = new Map()
    for(const r of data){
      const key = (r.trait||'') + '||' + (r.theme||'')
      if(!set.has(key)) set.set(key, {trait: r.trait, theme: r.theme})
    }
    return Array.from(set.values())
  }, [data])

  const filtered = useMemo(()=>{
    if(!trait || !theme) return []
    // filter and attempt to parse date; keep original if parse fails
    const items = data.filter(r => (r.trait||'')===trait && (r.theme||'')===theme)
    items.sort((a,b)=>{
      const da = Date.parse(a.date)
      const db = Date.parse(b.date)
      if(!isNaN(da) && !isNaN(db)) return da - db
      if(!isNaN(da)) return -1
      if(!isNaN(db)) return 1
      return (a.date||'').localeCompare(b.date||'')
    })
    return items
  }, [data, trait, theme])

  // pick a background image from the current filtered items (use first available)
  const bgImage = useMemo(()=>{
    if(!filtered || filtered.length===0) return null
    // prefer first item with a non-empty image_url
    const found = filtered.find(it => it.image_url && it.image_url.trim())
    return found ? found.image_url.trim() : null
  }, [filtered])

  // preload background image for smoother transitions
  useEffect(()=>{
    if(!bgImage) return
    const img = new Image()
    img.src = bgImage
    return ()=>{
      // no-op (let browser manage cache)
    }
  }, [bgImage])

  return (
  <div className="app" style={bgImage ? { backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.78), rgba(0, 0, 0, 0.78)), url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
          <header>
            <h1>Trait-Theme Timeline</h1>
          </header>

      <section className="controls">
        <div className="selectors">
          <label>
            Trait
            <select value={trait} onChange={e=>setTrait(e.target.value)}>
              <option value="">-- select trait --</option>
              {Array.from(new Set(data.map(r=>r.trait))).map(t=>t && <option key={t} value={t}>{t}</option>)}
            </select>
          </label>

          <label>
            Theme
            <select value={theme} onChange={e=>setTheme(e.target.value)}>
              <option value="">-- select theme --</option>
              {Array.from(new Set(data.filter(r=>r.trait===trait).map(r=>r.theme))).map(th=>th && <option key={th} value={th}>{th}</option>)}
            </select>
          </label>

          <label className="combo-picker">
            Or choose a combo
            <select onChange={e=>{
              const [t,th] = e.target.value.split('||')
              setTrait(t)
              setTheme(th)
            }}>
              <option value="">-- choose combo --</option>
              {combos.map(c => (
                <option key={(c.trait||'')+'||'+(c.theme||'')} value={(c.trait||'')+'||'+(c.theme||'')}>{(c.trait||'')} — {(c.theme||'')}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <main>
        {filtered.length>0 ? (
          <TimelineFlow items={filtered} />
        ) : (
          <div className="placeholder">No items to display. Make sure <code>public/trait_theme_timeline.csv</code> exists and has columns like <code>trait</code>, <code>theme</code>, <code>date</code>, <code>image_url</code>.</div>
        )}
      </main>

      <footer>
      </footer>
    </div>
  )
}
