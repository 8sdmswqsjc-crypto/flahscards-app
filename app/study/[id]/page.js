'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, RotateCw, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const backgrounds = [
  'linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFD700 100%)',
  'linear-gradient(135deg, #FF9A56 0%, #FFB347 50%, #FFA07A 100%)',
  'linear-gradient(135deg, #8B7355 0%, #A0826D 50%, #D2B48C 100%)',
  'linear-gradient(135deg, #EDC9AF 0%, #DEB887 50%, #CD853F 100%)',
  'linear-gradient(135deg, #0B1E3F 0%, #1A3A52 50%, #2E5266 100%)'
]

export default function StudyPage() {
  const params = useParams()
  const setId = params.id
  const [cardSet, setCardSet] = useState(null)
  const [cards, setCards] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [cardType, setCardType] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)

  useEffect(() => {
    loadCards()
  }, [])

  async function loadCards() {
    try {
      // Lataa korttisetti
      const { data: setData, error: setError } = await supabase
        .from('card_sets')
        .select('*')
        .eq('id', setId)
        .single()

      if (setError) throw setError

      setCardSet(setData)
      setCardType(setData.type)

      // Lataa kortit
      if (setData.type === 'flashcard') {
        const { data: cardsData, error: cardsError } = await supabase
          .from('flashcards')
          .select('*')
          .eq('card_set_id', setId)
          .order('created_at', { ascending: true })

        if (cardsError) throw cardsError
        setCards(cardsData || [])
      } else {
        const { data: cardsData, error: cardsError } = await supabase
          .from('multiple_choice')
          .select('*')
          .eq('card_set_id', setId)
          .order('created_at', { ascending: true })

        if (cardsError) throw cardsError
        setCards(cardsData || [])
      }
    } catch (error) {
      console.error('Error loading cards:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleFlip() {
    setIsFlipped(!isFlipped)
  }

  function goToNext() {
    setIsFlipped(false)
    setSelectedAnswer(null)
    setShowResult(false)
    setIsCorrect(null)
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(0)
    }
  }

  function goToPrevious() {
    setIsFlipped(false)
    setSelectedAnswer(null)
    setShowResult(false)
    setIsCorrect(null)
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else {
      setCurrentIndex(cards.length - 1)
    }
  }

  function handleCorrect() {
    setCorrectCount(correctCount + 1)
    goToNext()
  }

  function handleMultipleChoice(answer) {
    setSelectedAnswer(answer)
    const currentCard = cards[currentIndex]
    const correct = answer === currentCard.correct_answer
    setIsCorrect(correct)
    setShowResult(true)
    if (correct) {
      setCorrectCount(correctCount + 1)
    }
  }

  function shuffleArray(array) {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Ladataan...</div>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/">
            <button className="text-purple-400 flex items-center gap-2 mb-6 hover:text-purple-300">
              <ArrowLeft size={20} /> Takaisin
            </button>
          </Link>
          <div className="text-center text-white mt-20">
            <p className="text-xl">Kortteja ei löytynyt</p>
          </div>
        </div>
      </div>
    )
  }

  const currentCard = cards[currentIndex]
  const bgGradient = backgrounds[currentCard.background_index % 5]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Outfit:wght@400;600;700&display=swap');

        .flashcard {
          perspective: 1000px;
        }

        .flashcard-inner {
          position: relative;
          width: 100%;
          height: 400px;
          transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          transform-style: preserve-3d;
          cursor: pointer;
        }

        .flashcard-inner.flipped {
          transform: rotateY(180deg);
        }

        .flashcard-front,
        .flashcard-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 24px;
          padding: 40px;
          text-align: center;
          font-size: 28px;
          font-weight: 600;
          line-height: 1.5;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .flashcard-back {
          transform: rotateY(180deg);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .difficulty-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.3);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          backdrop-filter: blur(10px);
          color: white;
        }

        .multiple-choice-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 24px;
        }

        .choice-btn {
          padding: 20px;
          border: 2px solid rgba(167, 139, 250, 0.3);
          background: rgba(30, 41, 59, 0.6);
          border-radius: 12px;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }

        .choice-btn:hover:not(:disabled) {
          border-color: rgba(167, 139, 250, 0.8);
          background: rgba(30, 41, 59, 0.8);
          transform: translateY(-2px);
        }

        .choice-btn:disabled {
          cursor: not-allowed;
        }

        .choice-btn.selected {
          border-color: rgba(167, 139, 250, 1);
          background: rgba(167, 139, 250, 0.2);
        }

        .choice-btn.correct {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.2);
        }

        .choice-btn.incorrect {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.2);
        }

        .result-message {
          margin-top: 20px;
          padding: 16px;
          border-radius: 12px;
          font-weight: 600;
          text-center;
          font-size: 16px;
        }

        .result-correct {
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.5);
          color: #6ee7b7;
        }

        .result-incorrect {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.5);
          color: #fca5a5;
        }

        .explanation {
          margin-top: 16px;
          padding: 16px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          color: #93c5fd;
          font-size: 14px;
          line-height: 1.5;
        }

        .stats {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-bottom: 32px;
        }

        .stat-box {
          background: rgba(167, 139, 250, 0.1);
          border: 1px solid rgba(167, 139, 250, 0.3);
          padding: 16px 24px;
          border-radius: 12px;
          text-align: center;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .stat-value {
          color: #a78bfa;
          font-size: 28px;
          font-weight: 700;
        }

        .button-group {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-top: 32px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 14px 28px;
          font-size: 16px;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-secondary {
          background: rgba(167, 139, 250, 0.1);
          color: #c4b5fd;
          border: 1px solid rgba(167, 139, 250, 0.3);
        }

        .btn-secondary:hover {
          background: rgba(167, 139, 250, 0.2);
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          margin-top: 24px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          width: 100%;
          transition: width 0.3s ease;
        }
      `}</style>

      <div className="max-w-2xl mx-auto">
        <Link href="/">
          <button className="text-purple-400 flex items-center gap-2 mb-6 hover:text-purple-300 transition">
            <ArrowLeft size={20} /> Takaisin
          </button>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">{cardSet?.name}</h1>
          <p className="text-purple-200 mt-2">
            {cardType === 'flashcard' ? '🎴 Flashcard' : '❓ Monivalinta'}
          </p>
        </div>

        <div className="stats">
          <div className="stat-box">
            <div className="stat-label">Kortti</div>
            <div className="stat-value">
              {currentIndex + 1} / {cards.length}
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Osattu</div>
            <div className="stat-value">{correctCount}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Tarkkuus</div>
            <div className="stat-value">
              {cards.length > 0
                ? Math.round((correctCount / (currentIndex + 1)) * 100)
                : 0}
              %
            </div>
          </div>
        </div>

        {cardType === 'flashcard' ? (
          <>
            <div className="flashcard" onClick={handleFlip}>
              <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
                <div
                  className="flashcard-front"
                  style={{ background: bgGradient }}
                >
                  <div className="difficulty-badge">
                    {'⭐'.repeat(currentCard.difficulty || 1)}
                  </div>
                  {currentCard.question}
                </div>
                <div className="flashcard-back">
                  {currentCard.answer}
                </div>
              </div>
            </div>

            <div className="button-group">
              <button className="btn btn-secondary" onClick={goToPrevious}>
                ← Edellinen
              </button>
              <button className="btn btn-primary" onClick={handleCorrect}>
                ✓ Osattu
              </button>
              <button className="btn btn-secondary" onClick={goToNext}>
                Seuraava →
              </button>
            </div>

            <div className="text-center mt-6">
              <button
                className="text-purple-400 flex items-center gap-2 mx-auto hover:text-purple-300 transition"
                onClick={() => {
                  setCurrentIndex(0)
                  setIsFlipped(false)
                  setCorrectCount(0)
                }}
              >
                <RotateCw size={18} /> Nollaa laskuri
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              className="rounded-24 p-10 text-center mb-8 rounded-xl"
              style={{
                background: bgGradient,
                minHeight: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '600',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
              }}
            >
              <div>
                <div className="difficulty-badge" style={{ position: 'absolute', top: 16, right: 16 }}>
                  {'⭐'.repeat(currentCard.difficulty || 1)}
                </div>
                {currentCard.question}
              </div>
            </div>

            <div className="multiple-choice-grid">
              {(() => {
                const options = [
                  { label: 'A', value: currentCard.correct_answer },
                  { label: 'B', value: currentCard.option_b },
                  { label: 'C', value: currentCard.option_c },
                  { label: 'D', value: currentCard.option_d }
                ]
                return shuffleArray(options).map((option, idx) => (
                  <button
                    key={idx}
                    className={`choice-btn ${
                      selectedAnswer === option.value
                        ? isCorrect
                          ? 'correct'
                          : 'incorrect'
                        : ''
                    } ${
                      showResult && option.value === currentCard.correct_answer
                        ? 'correct'
                        : ''
                    }`}
                    onClick={() => handleMultipleChoice(option.value)}
                    disabled={showResult}
                  >
                    <span style={{ fontWeight: 700, marginRight: '8px' }}>
                      {option.label}.
                    </span>
                    {option.value}
                  </button>
                ))
              })()}
            </div>

            {showResult && (
              <>
                <div
                  className={`result-message ${
                    isCorrect ? 'result-correct' : 'result-incorrect'
                  }`}
                >
                  {isCorrect ? (
                    <>
                      <CheckCircle
                        size={20}
                        style={{ display: 'inline', marginRight: '8px' }}
                      />
                      Oikein!
                    </>
                  ) : (
                    <>
                      <XCircle
                        size={20}
                        style={{ display: 'inline', marginRight: '8px' }}
                      />
                      Väärin! Oikea vastaus on:{' '}
                      <strong>{currentCard.correct_answer}</strong>
                    </>
                  )}
                </div>

                {currentCard.explanation && (
                  <div className="explanation">
                    <strong>Selitys:</strong> {currentCard.explanation}
                  </div>
                )}

                <div className="button-group">
                  <button className="btn btn-secondary" onClick={goToPrevious}>
                    ← Edellinen
                  </button>
                  <button className="btn btn-primary" onClick={goToNext}>
                    Seuraava →
                  </button>
                </div>
              </>
            )}
          </>
        )}

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
