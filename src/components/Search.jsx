import React from 'react'

const Search = ({ searchTerm, setSearchTerm }) => {  //s3->recieve
  return (
    <div className="search">
      <div>
        <img src="./search.svg" alt="search" />
        <input
         type='text'
         placeholder='Search through thousands of movies'
         value={searchTerm}      //s4->use
         onChange={(e)=>setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  )
}

export default Search