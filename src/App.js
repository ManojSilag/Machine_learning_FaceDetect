import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecogination from './components/FaceRecogination/FaceRecogination';
import './App.css';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '07dced38230e464990c9731617b54b2c'
 });
 
const particlesOption ={
  particles: {
    number:{
      value: 50,
      density:{
        enable: true,
        value_area:800
      }
    }
  }
}
class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl:'',
      box:{},
      route: 'signin',
      issSignedIn:false
    }
  }
 
  calculateFaceLocation = (data) =>{
    const clarifaiFace =  data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width,height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
    }
  
     displayFaceBox = (box) => {
       console.log(box);
       
       this.setState({box:box});
     }


  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
  onButtonSubmit = () => {
  this.setState({imageUrl: this.state.input});
    app.models.predict( 
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      /*console.log(response.outputs[0].data.regions[0].region_info.bounding_box);*/
     .catch (err => console.log(err));
    }
      onRouteChange = (route) => {
        if(route === 'signout'){
          this.setState({issSignedIn: false});
        } else if (route === 'home'){
          this.setState({issSignedIn: true});
        }
        this.setState({route: route});
      }
 


  render() {
    const { issSignedIn , imageUrl , route ,box} =this.state;
    return (
      <div className="App">
      <Particles className = 'particles'
              params={particlesOption}
            />
      
      <Navigation issSignedIn={issSignedIn}
      onRouteChange={ this.onRouteChange }/>

      {route === 'home' ?
      <div>
      <Logo/>
      <Rank/>
      <ImageLinkForm
       onInputChange={this.onInputChange} 
      onButtonSubmit={this.onButtonSubmit}/>
      <FaceRecogination box={box}imageUrl={imageUrl}/> 
     </div>
     : (
       route === 'signin'
      ?<SignIn onRouteChange={this.onRouteChange}/>
      :<Register onRouteChange={this.onRouteChange}/>
     )
    }
      </div>
    );
  }
}

export default App;
