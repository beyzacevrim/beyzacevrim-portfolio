import useReveal from '../hooks/useReveal.js'

export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, visible] = useReveal()

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
