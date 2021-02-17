import React from 'react';
import { Text, View, FlatList, Image, TextInput, StyleSheet, Animated } from 'react-native';
import { gStyle, colors, device, fonts } from '../constants';

import Cast from '../components/Cast';
import HeaderHome from '../components/HeaderHome';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SliderBox } from "react-native-image-slider-box";

class Search extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showHeader: true,
      popularShowsList:[],
      images:[],
      focus: false,
      cancelOpacity: new Animated.Value(0),
      inputWidth: new Animated.Value(100),
      text: '',
      searchShowsList:[]
    };

    this.onBlur = this.onBlur.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onFocus = this.onFocus.bind(this);

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
    //this.getPopularShows();
  }

  getSearchShows = async (key) => {

    let url="http://api.tvmaze.com/";
    let method_name = "search/shows?q="+key;
 
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
          searchShowsList: resp,
        });
        console.log(resp);
      })
      .catch(error => {
      });
  }

  renderShowList = ({ item, index }) => {
    return(
      <TouchableOpacity onPress={() => this.props.navigation.navigate('DetailsScreen', { original: item.show.image.original, name: item.show.name, type: item.show.type, language: item.show.language, premiered: item.show.premiered, time: item.show.schedule.time, days: item.show.schedule.days.toString(), summary: item.show.summary, networkname: item.show.network.name, networkcountry: item.show.network.country.name })}>
        <View style={{ flexDirection: "row" }}>
          <Image style={{ height: 150, width: 100, margin: 5, resizeMode: "stretch" }} source={{ uri: item.show.image.medium }}></Image>
          <View style={{ flex: 1 }}>
              <Text style={gStyle.heading1}>{item.show.name}</Text>
              <Text style={gStyle.paragraph}>Type: {item.show.type}</Text>
              <Text style={gStyle.paragraph}>Network: {item.show.network.name}</Text>
              <Text style={gStyle.paragraph}>Time: {item.show.schedule.time}</Text>
              <Text style={gStyle.paragraph}>Language: {item.show.language}</Text>
          </View>
        </View>
      </TouchableOpacity>
      
    )
  }

  onBlur() {
    const { cancelOpacity, inputWidth, text } = this.state;

    this.setState({ focus: false });

    // if empty, go back to orignial state
    if (text === '') {
      Animated.timing(inputWidth, {
        duration: 300,
        toValue: 100,
        useNativeDriver: false
      }).start();
      Animated.timing(cancelOpacity, {
        duration: 300,
        toValue: 0,
        useNativeDriver: false
      }).start();
    }
  }

  onCancel() {
    Keyboard.dismiss();

    this.setState({ text: '' }, () => this.onBlur());
  }

  onFocus() {
    const { cancelOpacity, inputWidth } = this.state;

    this.setState({ focus: true });

    Animated.timing(inputWidth, {
      duration: 300,
      toValue: 80,
      useNativeDriver: false
    }).start();
    Animated.timing(cancelOpacity, {
      duration: 300,
      toValue: 1,
      useNativeDriver: false
    }).start();
  }

render () {
      const { cancelOpacity, focus, inputWidth, text } = this.state;

      // if there is focus or text in input, align left
      const inputOverride = focus || text ? { textAlign: 'left' } : {};
      // convert to percentage
      const percentage = inputWidth.interpolate({
        inputRange: [80, 100],
        outputRange: ['80%', '100%']
      });

      return (
        <View style={gStyle.container}>

          <View style={gStyle.pH4}>
            <ScrollView style={{ paddingTop: 20 }}>
              <View style={{ flexDirection: "row" }}>
                <TextInput
                    autoCapitalize="none"
                    autoFocus
                    keyboardAppearance="dark"
                    onBlur={this.onBlur}
                    onChangeText={input => this.setState({ text: input })}
                    onFocus={this.onFocus}
                    placeholder="Search"
                    placeholderTextColor={colors.searchIcon}
                    selectionColor={colors.brandPrimary}
                    style={styles.input}
                    value={text}
                  />
                  <View style={{ flex: 0.5 }}>
                    <TouchableOpacity style={gStyle.btnText} onPress={() => this.getSearchShows(this.state.text)}>
                      <Text style={{ textAlign: "center", color: "white", paddingVertical: 4 }}>Search</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              <View style={{ marginBottom: 60 }}>
              
                  <Text style={gStyle.heading}>Search Results</Text>
                  <FlatList
                    style={{ marginBottom: 50 }}
                    data={this.state.searchShowsList.slice(0, 5)}
                    numColumns={1}
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


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    flexDirection: 'row',
    paddingBottom: 12,
    paddingHorizontal: 8,
    paddingTop: device.iPhoneX ? 54 : 30,
    width: '100%'
  },
  containerInput: {
    width: '80%'
  },
  input: {
    backgroundColor: colors.searchBarBg,
    borderRadius: 4,
    color: colors.heading,
    fontFamily: fonts.regular,
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flex: 2
  },
  containerCancel: {
    width: '20%'
  },
  cancel: {
    color: colors.heading,
    fontFamily: fonts.light,
    fontSize: 16,
    paddingVertical: 4,
    textAlign: 'center'
  }
});

export default Search;
