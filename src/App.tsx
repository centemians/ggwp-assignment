import React, { useEffect, useState } from 'react';
import './App.css';

const fetchGames = async () => {
  const url = 'https://s3-ap-southeast-1.amazonaws.com/he-public-data/gamesarena274f2bf.json';
  try {
    const gamesPromise = await fetch(url);
    return await gamesPromise.json();
  } catch (err) {
    return;
  }
}

const GameCard = ({game}: any) => {
  return(
    <li className="game_data">
      <div className="row_data"><span>Title:</span> {game.title} </div>
      <div className="row_data"><span>Platform:</span> {game.platform} </div>
      <div className="row_data"><span>Genre:</span> {game.genre} </div>
      <div className="row_data"><span>Score:</span> {game.score} </div>
      <div className="row_data"><span>Editors Choice:</span> {game.editors_choice} </div>
    </li>
  );
}

function App() {
  const [games,setGames] = useState([] as any);
  const [searchedGames,setSearchedGames] = useState([] as any);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    (async () => {
      let allGames = await fetchGames();
      setGames(allGames.slice(1));
      setSearchedGames(allGames.slice(1));
    })();
  },[]);


  const handleTextChange = (e: any) => {
    setSearchText(e.target.value);
  }

  const searchData = () => {
    let data = [] as any;
    games.forEach((game: any) => {
        if(game.title.toLowerCase().includes(searchText.toLowerCase())){
          data.push(game);
        }
    });
    setSearchedGames(data);
  }

  const sortGamesOnScore = (sort: string) => {
    let allGames = games;
    allGames.sort((a: any,b: any) => {
      if(sort === "asc")
        return parseInt(a.score) - parseInt(b.score);
      
      return b.score - a.score;
    });


    setSearchedGames(() => allGames);
  } 

  const autocompleteMatch = (input: string) => {
  if (input === '') {
    return [];
  }
  var reg = new RegExp(input);
  return games.filter((game: any) => {
	  if (game?.title.match(reg)) {
  	  return game.title;
	  }
  });
}
 
const showResults = (val: any) => {
  let res = document.getElementById("result");
  //@ts-ignore
  res.innerHTML = '';
  let list = '';
  let terms = autocompleteMatch(val);
  for (let i=0; i<terms.length; i++) {
    list += '<li class="search_list">' + terms[i].title + '</li>';
  }
    //@ts-ignore
    res.innerHTML = '<ul class="search_container">' + list + '</ul>';
}

console.log("searched games: ", games);

  return (
    <div className="App">
      <div className="top_container">
      <button onClick={() => setSearchedGames(games)}>All Games</button>
      <div>
      <input value={searchText} onChange={(e) => handleTextChange(e)} onKeyUp={() => showResults(searchText)}/>
      <button onClick={searchData}>Search</button>
      </div>
      {autocompleteMatch(searchText).length && <div id="result" />}
      <button onClick={() => sortGamesOnScore("asc")}>Sort on score (asc)</button>
      <button onClick={() => sortGamesOnScore("desc")}>Sort on score (desc)</button>
      </div>
      <ul className="game_container">
      {searchedGames.map((game: any) => {
          return <GameCard game={game} />
      })}
      </ul>
    </div>
  );
}

export default App;
