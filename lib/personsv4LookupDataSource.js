/*
 * Copyright 2018 Brigham Young University
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as authn from '@byuweb/browser-oauth/byu-browser-oauth.mjs'
import parsePersonv4 from './parsePersonv4'

let authHeader = null
let observer = null

export function connect () {
  if (!observer) {
    observer = new authn.AuthenticationObserver(({ state, token, user, error }) => {
      // React to change
      authHeader = token ? token.authorizationHeader : null
    })
  }
}

function nameParams (search) {
  let surname = ''
  let restOfName = ''
  if (/,/.test(search)) {
    // Assume 'Last, First'
    [surname, restOfName] = search.split(',').map(s => s.trim())
  } else {
    // Assume 'First Middle Last'
    const words = search.split(' ')
    surname = words.slice(-1)
    restOfName = words.slice(0, -1).join(' ')
  }
  return `?surname=${surname}&rest_of_name=${restOfName}`
}

export function resolveSearchType (search) {
  return search.length < 1
      ? { q: `?surname=${search}`, label: 'Search' }
      : /^\d{3,9}$/.test(search)
          ? { q: `?byu_ids=${search}`, label: 'BYU ID' }
          : /^[a-z][a-z0-9]{2,7}$/.test(search)
              ? { q: `?net_ids=${search}`, label: 'Net ID' }
              : /^[^@]+@.+$/.test(search)
                  ? { q: `?email_addresses.email_address=${search}`, label: 'Email' }
                  : /^[^ ]+ +[^ ]+[^0-9]*$/.test(search)
                      ? { q: `${nameParams(search)}`, label: 'Name' }
                      : { q: `?surname=${search}`, label: 'Name' }
}

export async function search (searchText, pageLink) {
  if (!authHeader) {
    throw new Error('Not authenticated!')
  }

  const { q } = resolveSearchType(searchText)

  const apiBase = 'https://api.byu.edu:443/byuapi/persons/v4/'

  const init = {
    method: 'GET',
    headers: new window.Headers({ 'Authorization': authHeader })
  }

  const fieldSets = 'basic,addresses,email_addresses,phones,employee_summary'

  const url = pageLink || `${apiBase}${q}&field_sets=${fieldSets}&page_size=50`

  const response = await window.fetch(url, init)

  if (response.ok) {
    const json = await response.json()
    return parsePersonv4(json)
  } else if (response.status === 404) {
    return {}
  }

  const message = `Error ${response.status} while querying personsv4`
  throw new Error(message)
}

// in disconnectedCallback():
export function disconnect () {
  if (observer) {
    observer.disconnect()
  }
  observer = null
}
