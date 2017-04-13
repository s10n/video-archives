import React from 'react'

const Page = props => {
  return (
    <article className={`Page Page${props.page}`}>
      <header className="PageHeader">
        <h1 className="PageTitle">{props.title}</h1>
      </header>

      <main className="PageContent">
        <div className="PageContentInner">{props.children}</div>
      </main>
    </article>
  )
}

export default Page
