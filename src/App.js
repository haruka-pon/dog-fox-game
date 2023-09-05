import React, { Component } from 'react';
import axios from 'axios';
import './App.css'; // 新しいスタイルシートをインポート

class App extends Component {
  constructor() {
    super();
    this.state = {
      imageUrl: '',
      answer: '',
      correctCount: 0,
      gameOver: false, // ゲーム終了状態を管理
      correctImages: [], // 正解した画像の情報を保存
    };
    this.isGameOver = false; // カウントを停止するフラグ
  }

  componentDidMount() {
    this.fetchImage();
  }

  fetchImage = () => {
    const dogApiUrl = 'https://dog.ceo/api/breeds/image/random';
    const foxApiUrl = 'https://randomfox.ca/floof/';

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
    const { imageUrl, correctCount, correctImages } = this.state;
    let answer = '';

    if (!this.isGameOver) { // ゲーム終了時には正解ボタンを無効に
      if ((isDog && imageUrl.includes('dog')) || (!isDog && imageUrl.includes('fox'))) {
        answer = '正解！';
        // 新しい正解画像をランダムな位置に表示して増やす
        this.addCorrectImage();
        this.setState((prevState) => ({
          correctCount: prevState.correctCount + 1,
        }));
        this.fetchImage();
      } else {
        answer = '不正解。';
        this.endGame(); // ゲーム終了時の処理
      }
    }

    this.setState({ answer });
  }

  endGame = () => {
    this.isGameOver = true;
    this.setState({ gameOver: true });
  }

  restartGame = () => {
    this.isGameOver = false;
    this.setState({
      correctCount: 0,
      gameOver: false,
      correctImages: [], // ゲームをリスタートした際に正解画像リストをクリア
    });
    this.fetchImage();
  }

  // 正解画像をランダムな位置に追加
  addCorrectImage = () => {
    const { imageUrl, correctImages } = this.state;
    const imageInfo = {
      url: imageUrl,
      left: Math.random() * 80 + 10 + '%', // 水平位置をランダムに設定
      top: Math.random() * 80 + 10 + '%', // 垂直位置をランダムに設定
    };
    correctImages.push(imageInfo);
    this.setState({ correctImages });
  }

  render() {
    const { imageUrl, answer, correctCount, gameOver, correctImages } = this.state;

    return (
      <div className="App"
        style={{
          width: '100%',
          textAlign: 'center'
        }}
      >
        <h1>犬 or 狐 ゲーム</h1>
        <div className="frame-container"
          style={{
            width: '100%',
            textAlign: 'center'
          }}
        >
          <img
            src={imageUrl}
            alt="Animal"
            style={{ width: 'auto', height: '300px' }}
          />
          <div
            className="button-container"
            style={{
              margin: '20px auto 0 auto',
              width: '300px', height: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around'
            }}
          >
            <button
              onClick={() => this.checkAnswer(true)}
              className={`btn btn--circle ${gameOver ? 'disabled' : ''}`} // ゲーム終了時にボタンを無効に
            >
              犬
            </button>
            <button
              onClick={() => this.checkAnswer(false)}
              className={`btn btn--circle ${gameOver ? 'disabled' : ''}`} // ゲーム終了時にボタンを無効に
            >
              狐
            </button>
          </div>
          {/* 正解画像を表示 */}
          {correctImages.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt="Correct"
              className="correct-image"
              style={{ 
                left: image.left, top: image.top ,
                position:'absolute',
                maxWidth:'80px',
              zIndex:'-1'
              }}
            />
          ))}
          <p>正解数: {correctCount}</p>
          <p>{answer}</p>
          {gameOver && (
            <button
              onClick={this.restartGame}
              className="btn restart-button"
            >
              リスタート
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default App;
