export const GoogleForm = () => {
  return (
    <section
      className='container mt-20'
      id='form'
    >
      <h2 className='border-b pb-5 text-3xl leading-none font-semibold tracking-tight transition-colors'>
        Google form
      </h2>
      <iframe
        className='w-full rounded-xl'
        src='https://docs.google.com/forms/d/e/1FAIpQLSduL8Q-9lqPZABGqkyguIpw8zsd2_aijjP7e4kcCactxvE4bw/viewform?embedded=true'
        height='466'
        frameBorder='0'
        marginHeight={0}
        marginWidth={0}
      >
        Завантаження…
      </iframe>
    </section>
  )
}
