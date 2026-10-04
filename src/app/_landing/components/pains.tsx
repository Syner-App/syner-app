import styles from "@/app/_landing/landing.module.css"

const PAINS = [
  {
    title: "Te enteras tarde de que se acabó",
    text: "Descubres que no hay mora o que no quedan zapatos talla 38 cuando el cliente ya los está pidiendo.",
  },
  {
    title: "No sabes si este mes ganaste",
    text: "Vendes todos los días, pero entre gastos, insumos y deudas no es claro cuánto te queda.",
  },
  {
    title: "Cada pedido al proveedor es a ojo",
    text: "Pides lo que recuerdas que falta, no lo que de verdad hace falta.",
  },
]

export function Pains() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Cuando todo está en la cabeza, algo se escapa</h2>
        <ul className={styles.pains}>
          {PAINS.map((pain) => (
            <li key={pain.title} className={styles.pain}>
              <h3 className={styles.painTitle}>{pain.title}</h3>
              <p className={styles.painText}>{pain.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
