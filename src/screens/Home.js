import React from 'react';
import { Text, View, FlatList, Image } from 'react-native';
import { ScrollView } from 'react-navigation';
import { gStyle } from '../constants';
import { SliderBox } from "react-native-image-slider-box";

import Cast from '../components/Cast';
import HeaderHome from '../components/HeaderHome';
import PromotionBanner from '../components/PromotionBanner';
import ShowScroller from '../components/ShowScroller';
import { TouchableOpacity } from 'react-native-gesture-handler';

class Home extends React.Component {

  
  constructor(props) {
    super(props);

    this.state = {
      showHeader: true,
      popularShowsList:[],
      images:[]
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

  componentDidMount () {
    this.getPopularShows();
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
        //resp = "shows:"+resp;
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
      <TouchableOpacity onPress={() => this.props.navigation.navigate('DetailsScreen', { original: item.show.image.original, name: item.show.name, type: item.show.type, language: item.show.language, premiered: item.show.premiered, time: item.show.schedule.time, days: item.show.schedule.days.toString(), summary: item.show.summary, networkname: item.show.network.name, networkcountry: item.show.network.country.name })}>
        <View>
          <Image style={{ height: 150, width: 100, margin: 5, resizeMode: "stretch" }} source={{ uri: item.show.image.medium }}></Image>
        </View>
      </TouchableOpacity>
      
    )
  }

  render() {
    const { showHeader } = this.state;
    
    return (
      <View style={gStyle.container}>
        <HeaderHome show={showHeader} />

        <ScrollView
          bounces
          onScroll={this.onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <SliderBox
              images={this.state.images}
              sliderBoxHeight={480}
              onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
              dotColor="#FFEE58"
              inactiveDotColor="#90A4AE"
              autoplay
              circleLoop
              />

          <Text style={gStyle.heading}>Popular on TV Maze</Text>
          <FlatList
            data={this.state.popularShowsList.slice(0, 12)}
            horizontal
            renderItem={this.renderShowList}
            showsHorizontalScrollIndicator={false}
          />

          <Text style={gStyle.heading}>TV Maze ORIGINALS</Text>
          <FlatList
            data={this.state.popularShowsList.slice(23, 32)}
            horizontal
            renderItem={this.renderShowList}
            showsHorizontalScrollIndicator={false}
          />

          <View style={gStyle.spacer24} />
        </ScrollView>

        <Cast />
      </View>
    );
  }
}

export default Home;
