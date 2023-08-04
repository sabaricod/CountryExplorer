import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TextInput, Animated, Image, StyleSheet } from 'react-native';

const CountryListItem = React.memo(({ country }) => (
  <Animated.View style={styles.countryItem}>
    <Animated.Text style={styles.countryName}>{country.name.common}</Animated.Text>
  </Animated.View>
), (prevProps, nextProps) => {
  // Use a custom shouldComponentUpdate to prevent unnecessary re-renders
  return prevProps.country.cca3 === nextProps.country.cca3;
});

const App = ({ navigation }) => {
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const countrydata= await response.json();
      setCountries(countrydata);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const filterCountry = useMemo(() => {
    const filtereddata=countries.filter((country) => country.name.common.toLowerCase()===searchQuery.toLowerCase());

    console.log(filtereddata[0]?.currencies)
    if(filtereddata.length>0){
      return filtereddata;
    }
    else return countries
  }, [searchQuery, countries]);

  
  const keyExtractor = useCallback((item) => item.cca3, []);

  const renderItem = useCallback(({ item }) => (
    <CountryListItem country={item}/>
  ), []);

  const getItemLayout = useCallback((_, index) => ({
    length: 60, // Adjust the length based on your item height
    offset: 60 * index,
    index,
  }), []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Country"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {filterCountry.length!=1?<Animated.FlatList
        data={filterCountry}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        decelerationRate="fast"
        removeClippedSubviews={true}
      />:
      <React.Fragment>
      <Image 
      source={{ uri:"https://flagcdn.com/w320/hu.png"}}
      style={{width:100,height:80,resizeMode:'contain'}}
      />
      <Text style={styles.country}>{filterCountry[0].name.common}</Text>
      <Text style={styles.countryProperty}>Capital: {filterCountry[0].capital}</Text>
      <Text style={styles.countryProperty}>Population: {filterCountry[0].population}</Text>
      <Text style={styles.countryProperty}>Region: {filterCountry[0].region}</Text>
      <Text style={styles.countryProperty}>Subregion: {filterCountry[0].subregion}</Text>
      <Text style={styles.countryProperty}>Currency: {Object.values(filterCountry[0].currencies).join(', ')}</Text>
      <Text style={styles.countryProperty}>Languages: {Object.values(filterCountry[0].languages).join(', ')}</Text>
      </React.Fragment>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  countryItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  countryName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  country: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  countryProperty: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default App;
