import React from 'react';
import { Text, View, FlatList, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import { gStyle } from '../constants';

import Cast from '../components/Cast';
import HeaderHome from '../components/HeaderHome';
import { ScrollView } from 'react-native-gesture-handler';
import { SliderBox } from "react-native-image-slider-box";

class DetailsScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showHeader: true,
      popularShowsList:[],
      images:[this.props.navigation.getParam('original')],
      original: this.props.navigation.getParam('original'),
      name: this.props.navigation.getParam('name'),
      type: this.props.navigation.getParam('type'),
      language: this.props.navigation.getParam('language'),
      premiered: this.props.navigation.getParam('premiered'),
      time: this.props.navigation.getParam('time'),
      days: this.props.navigation.getParam('days'),
      summary: this.props.navigation.getParam('summary'),
      networkname: this.props.navigation.getParam('networkname'),
      networkcountry: this.props.navigation.getParam('networkcountry')
    };

    this.offset = 0;

    this.onScroll = this.onScroll.bind(this);
  }

  onScroll(event) {
    const { showHeader } = this.state;

    let show = showHeader;
    const currentOffset = event.nativeEvent.contentOffset.y;
    show = currentOffset < this.offset;

    if (show !== showHeader || this.offset <= 0) {
      // account for negative value with "bounce" offset
      if (this.offset <= 0) show = true;

      this.setState({
        showHeader: show
      });
    }

    this.offset = currentOffset;
  }

  getPopularShows = async () => {

    let url="http://api.tvmaze.com/";
    let method_name = "schedule";
 
    fetch(url+method_name, {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
      }).then((result) => result.json())
      .then((resp) => {
        this.setState({
          popularShowsList: resp,
          images:[resp[0].show.image.original,
          resp[1].show.image.original,
          resp[2].show.image.original,
          resp[3].show.image.original,
          resp[4].show.image.original]
        });
        console.log(this.state.images);
      })
      .catch(error => {
      });
  }

  renderShowList = ({ item, index }) => {
    return(
      <View>
        <Image style={{ height: 160, width: 120, margin: 5, resizeMode: "stretch" }} source={{ uri: item.show.image.medium }}></Image>
      </View>
      
    )
  }

    render () {
      return (
        <View style={gStyle.container}>

          <View style={gStyle.pH4}>
            <ScrollView>
              <View style={{ marginBottom: 60 }}>
                <View>
                  <SliderBox
                      images={this.state.images}
                      sliderBoxHeight={500}
                      onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
                      dotColor="#FFEE58"
                      inactiveDotColor="#90A4AE"
                      autoplay
                      circleLoop
                      />
                </View>
                <Text style={gStyle.heading}>{this.state.name}</Text>
                <Text style={gStyle.paragraph}>Type: {this.state.type}</Text>
                <Text style={gStyle.paragraph}>Language: {this.state.language}</Text>
                <Text style={gStyle.paragraph}>Days: {this.state.days}</Text>
                <Text style={gStyle.paragraph}>Time: {this.state.time}</Text>
                <Text style={gStyle.heading1}>Summary</Text>
                <Text style={gStyle.paragraph}>{this.state.summary}</Text>
                <Text style={gStyle.heading1}>Network Name:</Text>
                <Text style={gStyle.paragraph}>{this.state.networkname}</Text>
                <Text style={gStyle.heading1}>Country:</Text>
                <Text style={gStyle.paragraph}>{this.state.networkcountry}</Text>
              </View>
            </ScrollView>
          </View>

          <Cast />
        </View>
      )
    }
}


export default DetailsScreen;
