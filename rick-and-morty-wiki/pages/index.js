/*https://www.freecodecamp.org/news/how-to-create-a-dynamic-rick-and-morty-wiki-web-app-with-next-js/*/
/*for start: npm run dev*/

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';

const defaultEndpoint = `https://rickandmortyapi.com/api/character/`;


export async function getServerSideProps() {
  const res = await fetch(defaultEndpoint)
  const data = await res.json();
  return {
    props: {
      data
    }
  }
}

export default function Home({ data }) {
  const { info, results: defaultResults = [] } = data;

  const [results, updateResults] = useState(defaultResults);

  const [page, updatePage] = useState({
    ...info,
    current: defaultEndpoint
  });
  const { current } = page;

  useEffect(() => {
    // Don't bother making a request if it's the default endpoint as we
    // received that on the server

    if ( current === defaultEndpoint ) return;

    // In order to use async/await, we need an async function, and you can't
    // make the `useEffect` function itself async, so we can create a new
    // function inside to do just that

    async function request() {
      const res = await fetch(current)
      const nextData = await res.json();

      updatePage({
        current,
        ...nextData.info
      });

      // If we don't have `prev` value, that means that we're on our "first page"
      // of results, so we want to replace the results and start fresh

      if ( !nextData.info?.prev ) {
        updateResults(nextData.results);
        return;
      }

      // Otherwise we want to append our results

      updateResults(prev => {
        return [
          ...prev,
          ...nextData.results
        ]
      });
    }

    request();
  }, [current]);

  function handleLoadMore() {
    updatePage(prev => {
      return {
        ...prev,
        current: page?.next
      }
    });
  }

  function handleOnSubmitSearch(e) {
    e.preventDefault();

    const { currentTarget = {} } = e;
    const fields = Array.from(currentTarget?.elements);
    const fieldQuery = fields.find(field => field.name === 'query');

    const value = fieldQuery.value || '';
    const endpoint = `https://rickandmortyapi.com/api/character/?name=${value}`;

    updatePage({
      current: endpoint
    });
  }

  return (
    <div className="container">
      <main>
          <div className="pre_main_title">
            <div className="main_title">
              The Rick and Morty Wiki
            </div>
          </div>
          <h1 className="title">
            Wubba Lubba Dub Dub!
          </h1>

            <div className="searchplace">
                <form className="search" onSubmit={handleOnSubmitSearch}>
                  <input name="query" class="input" type="search" />
                  <button class="search_button">Search</button>
                </form>
            </div>
        <article className="grid">
          {results.map(result => {
            const { id, name, image } = result;
            return (
              <motion.li key={id} className="card" whileHover={{
                position: 'relative',
                zIndex: 1,
                scale: [1, 1.1, 1.1],

                transition: {
                  duration: .2
                }
              }}>
                <Link href="/character/[id]" as={`/character/${id}`}>
                  <a>
                    <img src={image} alt={`${name} Thumbnail`} />
                    <h3>{ name }</h3>
                  </a>
                </Link>
              </motion.li>
            )
          })}


        
         

        </article>
        <div className="load">
           <button class="load_button" onClick={handleLoadMore}>Load More</button>
        </div>
     
      
      </main>

      <footer>
          
            
          

        <a 
          className="description"
          href="https://www.instagram.com/mksmztv/"
          target="_blank"
          rel="noopener noreferrer"
        >
          #Powered_by {'  M. {#ZotOff}  '}
        </a>
      </footer>

    </div>
  )
}
