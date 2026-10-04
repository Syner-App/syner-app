import styles from "@/app/_landing/landing.module.css"

const STEPS = [
  {
    title: "Pide acceso",
    text: "Escríbenos por WhatsApp o por correo y cuéntanos qué vendes.",
  },
  {
    title: "Creamos tu negocio",
    text: "Configuramos tu organización y los usuarios de tu equipo.",
  },
  {
    title: "Carga tus productos y vende",
    text: "Registra tu catálogo y empieza a vender con Syner desde el primer día.",
  },
]

export function Steps() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Así empiezas</h2>
        <ol className={styles.steps}>
          {STEPS.map((step) => (
            <li key={step.title} className={styles.step}>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
