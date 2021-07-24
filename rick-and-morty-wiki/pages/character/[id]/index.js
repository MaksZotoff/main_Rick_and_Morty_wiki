import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';

const defaultEndpoint = `https://rickandmortyapi.com/api/character/`;

export async function getServerSideProps({ query }) {
  const { id } = query;
  const res = await fetch(`${defaultEndpoint}${id}`);
  const data = await res.json();
  return {
    props: {
      data
    }
  }
}

export default function Character({ data }) {
  const { name, image, gender, location, origin, species, status } = data;
  
  return (
    <div className="container">
      <Head>
        <title>{ name }</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">{ name }</h1>

        <div className="profile">
          
                  <motion.li key={image} className="profile-image" whileHover={{
                      position: 'relative',
                      zIndex: 1,
                    
                      scale: [1, 1.2, 1.2],

                      transition: {
                        duration: .2
                      }
                    }}>  
  
                      <img src={image} alt={name} />
        
                    </motion.li>


  
          
            
            <div className="profile-details">
              <h2>Character Details</h2>
              <ul>
                <li>
                  <strong>Status:</strong> { status }
                </li>
                <li>
                  <strong>Gender:</strong> { gender }
                </li>
                <li>
                  <strong>Species:</strong> { species }
                </li>
                <li>
                  <strong>Location:</strong> { location?.name }
                </li>
                <li>
                  <strong>Originally From:</strong> { origin?.name }
                </li>
              </ul>
            </div>
        </div>

        <p className="back_button">
          <Link href="/">
            <a>
              Back to All Characters
            </a>
          </Link>
        </p>
      </main>
      
    </div>
  )
}
