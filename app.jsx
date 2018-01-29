let PLAYERS = [
  {
    name: "Mick",
    score: 0,
    id: 1,
  },
  {
    name: "Craig",
    score: 0,
    id: 2,
  },
  {
    name: "Dorothy",
    score: 0,
    id: 3,
  },
  {
    name: "Leslie",
    score: 0,
    id: 4,
  },
];

let nextId = 5;

/*
    Form where user enters new name 
*/

let AddPlayerForm = React.createClass( {
    propTypes: {
        onAdd: React.PropTypes.func.isRequired,
    },

    getInitialState: function() {
        return {
            name: "",
        };
    },

    onNameChange: function(e){
        this.setState({name: e.target.value});
    },

    onSubmit: function(e){
     e.preventDefault();
     this.props.onAdd(this.state.name);
     this.setState({name: ""});
  },

  render: function() {
      return (
        <div className="add-player-form">
             <form onSubmit={this.onSubmit}>
                <input type="text" value={this.state.name} onChange={this.onNameChange}/>
                <input type="submit" value="Add Player"/>
             </form>
        </div>
      );
  }
});


/*
  create a statistics component - track number of players and points
*/

function Stats(props){
    let totalPlayers = props.players.length;
    let totalPoints = props.players.reduce(function(total, player){
        return total + player.score;
    },0);

    return (
     <table className="stats">
        <tbody>
            <tr>
                <td>Players:</td>
                <td>{totalPlayers}</td>
            </tr>
            <tr>
                <td>Total Points:</td>
                <td>{totalPoints}</td>
            </tr>
        </tbody>
     </table>
    )
}

/* Header */

function Header(props) {
  return (
    <div className="header">
     <Stats players={props.players}/>
      <h1>{props.title}</h1>
    </div>
  );
}

Header.propTypes = {
  title: React.PropTypes.string.isRequired,
  players: React.PropTypes.array.isRequired,
};


/* 
   Counter component 
*/

function Counter(props){
        return (
            <div className="counter">
              <button className="counter-action decrement" onClick={function() {props.onChange(-1);} }> - </button>
              <div className="counter-score"> {props.score} </div>
              <button className="counter-action increment" onClick={function() {props.onChange(+1);} }> + </button>
            </div>
      );
}



Counter.propTypes = {
    score: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired,
}

/* 
   Player component 
*/

function Player(props) {
  return (
    <div className="player">
      <div className="player-name">
          <a className="remove-player" onClick={props.onRemove}>&#x274C;</a>
        {props.name}
      </div>
      <div className="player-score">
        <Counter score={props.score} onChange={props.onScoreChange} />
      </div>
    </div>
  );
}

Player.propTypes = {
  name: React.PropTypes.string.isRequired,
  score: React.PropTypes.number.isRequired,
  onScoreChange: React.PropTypes.func.isRequired,
  onRemove: React.PropTypes.func.isRequired,
};


/*
  Main Application Definition with Application Methods 
*/

let Application = React.createClass({
     propTypes: {
      title: React.PropTypes.string,
      initialPlayers: React.PropTypes.arrayOf(React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        score: React.PropTypes.number.isRequired,
        id: React.PropTypes.number.isRequired,
      })).isRequired,
    },

    getDefaultProps: function() {
        return  {
            title: "Scoreboard",
        }
    },

    getInitialState: function() {
        return {
            players: this.props.initialPlayers,
        };
    },

    onScoreChange: function(index,amountChanged){
        console.log('onScoreChange', index, amountChanged);
        this.state.players[index].score += amountChanged;
        this.setState(this.state);
    },

    onPlayerAdd: function(name) {
        console.log('Player added: ', name);
        this.state.players.push({
            name: name,
            score: 0,
            id: nextId,
        });
        this.setState(this.state);
        nextId += 1;
    },

    onRemovePlayer: function(index){
      this.state.players.splice(index, 1); // remove current item
        this.setState(this.state);  // re-render
    },

    render: function() {
     return (
        <div className="scoreboard">
          <Header title={this.props.title} players={this.state.players}/>

          <div className="players">
            {this.state.players.map(function(player, index ) {
              return (
                <Player
                    onScoreChange={function(amountChanged) {this.onScoreChange(index, amountChanged)}.bind(this)}
                    onRemove={function() {this.onRemovePlayer(index)}.bind(this)}
                    name={player.name}
                    score={player.score}
                    key={player.id} />
            );
            }.bind(this))}
          </div>
         <AddPlayerForm onAdd={this.onPlayerAdd}/>
        </div>
  );
 }
});


ReactDOM.render(<Application initialPlayers={PLAYERS}/>, document.getElementById('container'));
