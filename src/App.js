import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {
      imageUrl: '',
      answer: '',
    };
  }

  componentDidMount() {
    this.fetchImage();
  }

  fetchImage = () => {
    // Dog APIのURL
    const dogApiUrl = 'https://dog.ceo/api/breeds/image/random';
    
    // Random Fox APIのURL
    const foxApiUrl = 'https://randomfox.ca/floof/';

    // ランダムに犬か狐の画像を取得
    const isDog = Math.random() < 0.5;

    const apiUrl = isDog ? dogApiUrl : foxApiUrl;

    axios.get(apiUrl)
      .then((response) => {
        this.setState({
          imageUrl: isDog ? response.data.message : response.data.image,
          answer: '',
        });
      })
      .catch((error) => {
        console.error('Error fetching image:', error);
      });
  }

  checkAnswer = (isDog) => {
    const { imageUrl } = this.state;
    let answer = '';
    
    if ((isDog && imageUrl.includes('dog')) || (!isDog && imageUrl.includes('fox'))) {
      answer = '正解！';
      this.fetchImage(); // 正解したら次の画像を取得
    } else {
      answer = '不正解。';
    }
    
    this.setState({ answer });
  }

  render() {
    const { imageUrl, answer } = this.state;

    return (
      <div className="App"
      style={{
        width:'100%',
        textAlign:'center'
      }}
      >
        <h1>犬 or 狐 ゲーム</h1>
        <div className="frame-container"
        style={{
          width:'100%',
          textAlign:'center'
        }}
        >
          <img
            src={imageUrl}
            alt="Animal"
            style={{ width: 'auto', height: '300px' }} // 画像の高さを300pxに固定
          />
          <div
           className="button-container"
           style={{
            margin:'0 auto',
            width: '300px', height: 'auto' ,
          display : 'flex',
        alignItems:'center',
        justifyContent:'space-around'
      }}
           >
            <button onClick={() => this.checkAnswer(true)}>犬</button>
            <button onClick={() => this.checkAnswer(false)}>狐</button>
          </div>
          <p>{answer}</p>
        </div>

      </div>
    );
  }
}

export default App;
