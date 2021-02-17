import React from 'react';
import {
  Animated,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  FlatList
} from 'react-native';
import { colors, device, fonts } from '../constants';

class HeaderSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      focus: false,
      cancelOpacity: new Animated.Value(0),
      inputWidth: new Animated.Value(100),
      text: '',
      searchShowsList:[]
    };

    this.onBlur = this.onBlur.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  componentDidMount () {
    this.getSearchShows();
  }

  getSearchShows = async (key) => {

    let url="http://api.tvmaze.com/";
    let method_name = "search/shows?q="+ke;
 
    fetch(url+method_name, {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
      }).then((result) => result.json())
      .then((resp) => {
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
      <View>
        <Image style={{ height: 160, width: 120, margin: 5, resizeMode: "stretch" }} source={{ uri: item.show.image.medium }}></Image>
      </View>
      
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

  onSearch = () => {

  }

  render() {
    const { cancelOpacity, focus, inputWidth, text } = this.state;

    // if there is focus or text in input, align left
    const inputOverride = focus || text ? { textAlign: 'left' } : {};
    // convert to percentage
    const percentage = inputWidth.interpolate({
      inputRange: [80, 100],
      outputRange: ['80%', '100%']
    });

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.containerInput, { width: percentage }]}>
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
            style={[styles.input, inputOverride]}
            value={text}
          />
        </Animated.View>
        <Animated.View
          style={[styles.containerCancel, { opacity: cancelOpacity }]}
        >
          <TouchableOpacity activeOpacity={0.7} onPress={this.onCancel}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
        <FlatList
            style={{ marginBottom: 50 }}
            data={this.state.searchShowsList.slice(0, 3)}
            numColumns={3}
            renderItem={this.renderShowList}
            showsHorizontalScrollIndicator={false}
            />
      </View>
    );
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
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4
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

export default HeaderSearch;
