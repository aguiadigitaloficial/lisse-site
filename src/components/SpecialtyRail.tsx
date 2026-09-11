import separatorMark from '../assets/hero/separator-mark.png'

type SpecialtyRailProps = {
  items: readonly string[]
  reveal?: boolean
  variant?: 'default' | 'hero'
}

export function SpecialtyRail({
  items,
  reveal = false,
  variant = 'default',
}: SpecialtyRailProps) {
  return (
    <div
      className={`specialty-rail specialty-rail--${variant}`}
      aria-label="Especialidades"
      data-reveal={reveal ? 'fade' : undefined}
    >
      <div className="specialty-rail__track">
        {items.map((item, index) => (
          <div className="specialty-rail__item" key={item}>
            <span>{item}</span>
            {index < items.length - 1 && (
              <img src={separatorMark} alt="" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
