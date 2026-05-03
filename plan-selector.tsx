'use client'

import { PLANOS, type PlanoConfig } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Check, Zap, Clock, Crown, Sparkles } from 'lucide-react'

interface PlanSelectorProps {
  selectedPlan: PlanoConfig | null
  onSelectPlan: (plan: PlanoConfig) => void
}

const planIcons: Record<string, React.ReactNode> = {
  '1d': <Clock className="w-5 h-5" />,
  '3d': <Zap className="w-5 h-5" />,
  '7d': <Sparkles className="w-5 h-5" />,
  '30d': <Crown className="w-5 h-5" />,
  'lifetime': <Crown className="w-5 h-5" />,
}

export function PlanSelector({ selectedPlan, onSelectPlan }: PlanSelectorProps) {
  const formatPrice = (centavos: number) => {
    return (centavos / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100)
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-mono text-primary flex items-center gap-2">
        <span className="text-neon-green">[</span>
        SELECIONE SEU PLANO
        <span className="text-neon-green">]</span>
      </h2>
      
      <div className="grid gap-3">
        {PLANOS.map((plan) => {
          const isSelected = selectedPlan?.id === plan.id
          const discount = calculateDiscount(plan.precoOriginal, plan.preco)
          const isLifetime = plan.id === 'lifetime'
          
          return (
            <button
              key={plan.id}
              onClick={() => onSelectPlan(plan)}
              className={cn(
                'relative w-full p-4 rounded-lg border transition-all duration-300',
                'text-left font-mono group',
                isSelected
                  ? 'border-primary bg-primary/10 neon-border'
                  : 'border-border bg-card/50 hover:border-primary/50 hover:bg-card',
                isLifetime && 'ring-1 ring-neon-purple/30'
              )}
            >
              {/* Badge de desconto */}
              {discount > 0 && (
                <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded font-bold">
                  -{discount}%
                </span>
              )}
              
              {/* Badge lifetime */}
              {isLifetime && (
                <span className="absolute -top-2 left-4 bg-neon-purple text-white text-xs px-2 py-0.5 rounded font-bold">
                  MELHOR ESCOLHA
                </span>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'p-2 rounded-md',
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                    'transition-colors'
                  )}>
                    {planIcons[plan.id]}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'font-bold',
                        isSelected && 'text-primary'
                      )}>
                        {plan.nome}
                      </span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {plan.duracao}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xs text-muted-foreground line-through">
                    {formatPrice(plan.precoOriginal)}
                  </div>
                  <div className={cn(
                    'text-xl font-bold',
                    isSelected ? 'text-primary neon-glow' : 'text-foreground'
                  )}>
                    {formatPrice(plan.preco)}
                  </div>
                </div>
              </div>
              
              {/* Barra de progresso visual */}
              <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    'h-full transition-all duration-500',
                    isSelected ? 'bg-primary' : 'bg-transparent'
                  )}
                  style={{ width: isSelected ? '100%' : '0%' }}
                />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
