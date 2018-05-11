import {LitElement, html} from '@polymer/lit-element'
import { svg } from 'lit-html'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch'

class ByuPersonLookup extends LitElement {
  static get properties () {
    return {
      search: String,
      results: Object
      /* TODO: include search parameter type (person_id, home_town, etc..) */
    }
  }

  _render ({search, results}) {
    console.log(`search=${search}, results=${results}`)
    const [iconH, iconW, , , iconPath] = faSearch.icon
    console.log({iconH, iconW, iconPath})
    const css=html`
      <style>
        :host {
          padding: 1rem;
          font-size: 1.1rem;
        }
        * {
         font-family: 'Gotham A', 'Gotham B', Helvetica Nue, Helvetica, sans-serif; 
        }
        @media not(speech) {
          .srOnly { display: none }
        }
        input[type="search"] {
          padding: 0.3rem;
          border: thin solid #333333;
          border-radius: 0.2rem;
          margin-right: 0.2rem;
          min-width: 15rem;
        }
        button {
          padding: 0.3rem 0.7rem;
          border: thin solid #333333;
          border-radius: 0.2rem;
          background-color: #2d83d9;
          color: white;
        }
      </style>
    `

    return html`
    ${css}
    <div>
      <label class="srOnly" for="search">Search For</label>
      <input
        id="search"
        type="search"
        size="12"
        value$="${search}"
        on-input="${e => this.searchChange(e)}"
        on-search="${e => this.doSearch(e)}"
      >
      <button>
        <svg alt="Search" width="14" height="14" viewBox="0 0 512 512">
          <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" fill="white"/>
        </svg>
      </button>
    </div>
    <byu-person-lookup-results results="${results}>"</byu-person-lookup-results>
    `
  }

  searchChange (e) {
    this.search = e.target.value
    console.log(`search=${this.search}`)
  }

  doSearch () {
    console.log(`last: ${this.lastName}, first: ${this.firstName}`)
    const s = this.search
    this.results = ['', '','','','','','','','','','','','','','','','','','','']
    .map((v, i) => {
      return {
        name: `${s} ${i}`,
        byuId: (Math.random() * 1000000000).toFixed(0),
        netId: `${s.substr(0, 4).concat((Math.random() * 100000).toFixed(0).substr(0,2))}`
      }
    })
  }

}

console.log('registering person lookup')
window.customElements.define('byu-person-lookup', ByuPersonLookup)
