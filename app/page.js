'use client'

import { useState, useEffect } from 'react'
import { supabase, getOrCreateSession, getSessionId, saveEncryptedApiKey, getDecryptedApiKey } from '@/lib/supabase'
import { Sparkles, Plus, Trash2, Edit2, Play } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [cardSets, setCardSets] = useState([])
  const [showApiForm, setShowApiForm] = useState(false)
  const [showNewSetForm, setShowNewSetForm] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [sessionId, setSessionId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [topic, setTopic] = useState('')
  const [numCards, setNumCards] = useState(10)
  const [cardType, setCardType] = useState('flashcard')
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    initializeSession()
  }, [])

  async function initializeSession() {
    try {
      const token = await getOrCreateSession()
      const id = await getSessionId(token)
      setSessionId(id)
      
      // Lataa tallennettu API-avain
      const savedKey = await getDecryptedApiKey(id, 'anthropic')
      if (savedKey) {
        setApiKey(savedKey)
        setShowApiForm(false)
      } else {
        setShowApiForm(true)
      }
      
      // Lataa korttisettit
      await loadCardSets(id)
    } catch (error) {
      console.error('Error initializing session:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadCardSets(id) {
    const { data, error } = await supabase
      .from('card_sets')
      .select('*')
      .eq('session_id', id)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error loading card sets:', error)
      return
    }
    
    setCardSets(data || [])
  }

  async function handleSaveApiKey() {
    if (!apiKey.trim()) {
      alert('Anna API-avain!')
      return
    }
    
    try {
      await saveEncryptedApiKey(sessionId, 'anthropic', apiKey)
      setShowApiForm(false)
    } catch (error) {
      console.error('Error saving API key:', error)
      alert('Virhe API-avaimen tallentamisessa')
    }
  }

  async function handleGenerateCards() {
    if (!topic.trim()) {
      alert('Anna aihealue!')
      return
    }

    if (!apiKey.trim()) {
      alert('Anna API-avain ensin!')
      return
    }

    setGenerating(true)

    try {
      const typeText = cardType === 'flashcard' ? 'flashcard' : 'monivalinta'
      let prompt = ''

      if (cardType === 'flashcard') {
        prompt = `Luo ${numCards} flashcard-korttia aiheesta "${topic}".

Vaatimukset:
- Ensimmäiset kortit (1-3) ovat HELPPOJA perusteita
- Keskimmäiset kortit (4-7) ovat KESKITASON vaikeita
- Viimeiset kortit (8-${numCards}) ovat HAASTAVIA ja syvempiä

Vastaa TÄSMÄLLEEN seuraavassa JSON-formaatissa, ilman mitään muuta tekstiä:
[
  {"question": "Kysymys 1?", "answer": "Vastaus 1", "difficulty": 1},
  {"question": "Kysymys 2?", "answer": "Vastaus 2", "difficulty": 2}
]`
      } else {
        prompt = `Luo ${numCards} monivalinta-korttia aiheesta "${topic}".

Vaatimukset:
- Ensimmäiset kortit (1-3) ovat HELPPOJA
- Keskimmäiset kortit (4-7) ovat KESKITASON vaikeita
- Viimeiset kortit (8-${numCards}) ovat HAASTAVIA

Vaihtoehdot A, B, C, D - oikea vastaus voi olla mikä tahansa niistä.

Vastaa TÄSMÄLLEEN seuraavassa JSON-formaatissa, ilman mitään muuta tekstiä:
[
  {
    "question": "Kysymys 1?",
    "correct_answer": "Oikea vastaus",
    "option_b": "Väärä vastaus 1",
    "option_c": "Väärä vastaus 2",
    "option_d": "Väärä vastaus 3",
    "explanation": "Selitys miksi tämä on oikea",
    "difficulty": 1
  }
]`
      }

      const response = await fetch('/api/generate-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, numCards })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'API error')
      }

      const { cards } = await response.json()

      // Tallenna kortit Supabaseen
      const { data: setData, error: setError } = await supabase
        .from('card_sets')
        .insert([
          {
            session_id: sessionId,
            name: topic,
            type: cardType,
            description: `${cards.length} korttia`
          }
        ])
        .select()

      if (setError) throw setError

      const cardSetId = setData[0].id

      // Tallenna kortit
      if (cardType === 'flashcard') {
        const cardsToInsert = cards.map((card, index) => ({
          card_set_id: cardSetId,
          question: card.question,
          answer: card.answer,
          difficulty: card.difficulty || Math.floor((index / numCards) * 3) + 1,
          background_index: Math.floor(Math.random() * 5)
        }))

        const { error: insertError } = await supabase
          .from('flashcards')
          .insert(cardsToInsert)

        if (insertError) throw insertError
      } else {
        const cardsToInsert = cards.map((card, index) => ({
          card_set_id: cardSetId,
          question: card.question,
          correct_answer: card.correct_answer,
          option_b: card.option_b,
          option_c: card.option_c,
          option_d: card.option_d,
          explanation: card.explanation || '',
          difficulty: card.difficulty || Math.floor((index / numCards) * 3) + 1,
          background_index: Math.floor(Math.random() * 5)
        }))

        const { error: insertError } = await supabase
          .from('multiple_choice')
          .insert(cardsToInsert)

        if (insertError) throw insertError
      }

      // Päivitä näyttöä
      await loadCardSets(sessionId)
      setTopic('')
      setNumCards(10)
      setShowNewSetForm(false)
    } catch (error) {
      console.error('Error generating cards:', error)
      alert('Virhe korttien luomisessa: ' + error.message)
    } finally {
      setGenerating(false)
    }
  }

  async function handleDeleteSet(id) {
    if (confirm('Poista tämä korttisetti?')) {
      const { error } = await supabase
        .from('card_sets')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Error deleting set:', error)
        alert('Virhe poistamisessa')
      } else {
        await loadCardSets(sessionId)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Ladataan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Outfit:wght@400;600;700&display=swap');
        
        .title {
          font-family: 'Playfair Display', serif;
          background: linear-gradient(135deg, #a78bfa, #fbbf24);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .card-set-item {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(167, 139, 250, 0.2);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .card-set-item:hover {
          background: rgba(30, 41, 59, 0.8);
          border-color: rgba(167, 139, 250, 0.5);
          transform: translateY(-4px);
        }

        .set-name {
          font-weight: 700;
          color: #e0e7ff;
          margin-bottom: 8px;
          font-size: 18px;
        }

        .set-type {
          display: inline-block;
          background: rgba(167, 139, 250, 0.2);
          color: #c4b5fd;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .set-description {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          margin-bottom: 16px;
        }

        .set-actions {
          display: flex;
          gap: 8px;
        }

        .btn {
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
        }

        .btn-play {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          flex: 1;
        }

        .btn-play:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-delete {
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .btn-delete:hover {
          background: rgba(239, 68, 68, 0.3);
        }

        .btn-primary {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 14px 28px;
          font-size: 16px;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
        }

        .form-container {
          background: rgba(30, 41, 59, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(167, 139, 250, 0.2);
          border-radius: 16px;
          padding: 32px;
          max-width: 600px;
          margin: 0 auto 40px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          color: #e0e7ff;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 12px;
          background: rgba(51, 65, 85, 0.5);
          border: 1px solid rgba(167, 139, 250, 0.2);
          border-radius: 8px;
          color: white;
          font-family: inherit;
          font-size: 14px;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: rgba(167, 139, 250, 0.5);
          background: rgba(51, 65, 85, 0.8);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .button-group {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .btn-secondary {
          background: rgba(167, 139, 250, 0.1);
          color: #c4b5fd;
          border: 1px solid rgba(167, 139, 250, 0.3);
          padding: 12px 24px;
        }

        .btn-secondary:hover {
          background: rgba(167, 139, 250, 0.2);
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: rgba(255, 255, 255, 0.6);
        }

        .empty-icon {
          font-size: 60px;
          margin-bottom: 20px;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="title text-5xl font-bold mb-4">Flashcards</h1>
          <p className="text-purple-200">Luo ja jaa oppimismateriaaleja tekoälyn avulla</p>
        </div>

        {/* API-avain lomake */}
        {showApiForm && (
          <div className="form-container">
            <h2 className="text-2xl font-bold text-white mb-6">Asetus: API-avain</h2>
            <p className="text-purple-200 mb-6 text-sm">
              Tarvitset Anthropic API-avaimen korttien luomiseen.{' '}
              <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline">
                Hae ilmainen avain täältä
              </a>
            </p>
            <div className="form-group">
              <label>Anthropic API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
              />
            </div>
            <div className="button-group">
              <button className="btn btn-primary" onClick={handleSaveApiKey}>
                Tallenna avain
              </button>
            </div>
          </div>
        )}

        {/* Uuden setin luomisen lomake */}
        {showNewSetForm && (
          <div className="form-container">
            <h2 className="text-2xl font-bold text-white mb-6">Luo uusi korttisetti</h2>
            
            <div className="form-group">
              <label>Korttien tyyppi</label>
              <select value={cardType} onChange={(e) => setCardType(e.target.value)}>
                <option value="flashcard">Flashcard (kysymys + vastaus)</option>
                <option value="multiple_choice">Monivalinta (4 vaihtoehtoa)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Aihealue</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Esim. Antiikin Rooma, Biologia, Matematiikka..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Korttien määrä: {numCards}</label>
              <input
                type="range"
                min="5"
                max="50"
                value={numCards}
                onChange={(e) => setNumCards(parseInt(e.target.value))}
              />
            </div>

            <div className="button-group">
              <button className="btn btn-primary" onClick={handleGenerateCards} disabled={generating}>
                {generating ? 'Luodaan...' : <><Sparkles size={18} /> Luo kortit</>}
              </button>
              <button className="btn btn-secondary" onClick={() => setShowNewSetForm(false)}>
                Peruuta
              </button>
            </div>
          </div>
        )}

        {/* Korttisettien lista */}
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Omat korttisettit ({cardSets.length})</h2>
            <button className="btn btn-primary" onClick={() => setShowNewSetForm(!showNewSetForm)}>
              <Plus size={20} /> Uusi setti
            </button>
          </div>

          {cardSets.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3 className="text-xl font-bold text-white mb-2">Ei korttisettejä vielä</h3>
              <p>Luo ensimmäinen setti klikkaamalla "Uusi setti" -nappia</p>
            </div>
          ) : (
            <div className="card-grid">
              {cardSets.map((set) => (
                <div key={set.id} className="card-set-item">
                  <div className="set-name">{set.name}</div>
                  <div className="set-type">
                    {set.type === 'flashcard' ? '🎴 Flashcard' : '❓ Monivalinta'}
                  </div>
                  <div className="set-description">{set.description}</div>
                  <div className="set-actions">
                    <Link href={`/study/${set.id}`}>
                      <button className="btn btn-play">
                        <Play size={16} /> Harjoittele
                      </button>
                    </Link>
                    <button className="btn btn-delete" onClick={() => handleDeleteSet(set.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
