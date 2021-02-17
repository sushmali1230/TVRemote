import React from 'react';
import { Text, View, FlatList, Image } from 'react-native';
import { gStyle } from '../constants';

import Cast from '../components/Cast';
import HeaderHome from '../components/HeaderHome';
import { ScrollView } from 'react-native-gesture-handler';
import { SliderBox } from "react-native-image-slider-box";

class TvShows extends React.Component {

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
      <View>
        <Image style={{ height: 160, width: 120, margin: 5, resizeMode: "stretch" }} source={{ uri: item.show.image.medium }}></Image>
      </View>
      
    )
  }

    render () {
      return (
        <View style={gStyle.container}>
          <HeaderHome show />

          <View style={gStyle.spacer96} />

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
                  <Text style={gStyle.heading}>TV Shows</Text>
                  <FlatList
                    style={{ marginBottom: 50 }}
                    data={this.state.popularShowsList.slice(0, 12)}
                    numColumns={3}
                    renderItem={this.renderShowList}
                    showsHorizontalScrollIndicator={false}
                  />
              </View>
            </ScrollView>
          </View>

          <Cast />
        </View>
      )
    }
}

// const TvShows = () => (
  
//   <View style={gStyle.container}>
//     <HeaderHome show />

//     <View style={gStyle.spacer96} />

//     <View style={gStyle.pH4}>
//       <Text style={gStyle.heading}>TV Shows</Text>
//     </View>

//     <Cast />
//   </View>
// );

export default TvShows;
