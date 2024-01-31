import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [conversionRate, setConversionRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);

  useEffect(() => {
    fetchConversionRate();
  }, [fromCurrency, toCurrency]);

  const fetchConversionRate = async () => {
    try {
      const apiKey = ""; // Replace with your API key
      const response = await fetch(
        `https://open.er-api.com/v6/latest/${fromCurrency}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: apiKey,
          },
        }
      );
      const data = await response.json();
      const rate = data.rates[toCurrency];
      setConversionRate(rate);
    } catch (error) {
      console.error("Error fetching conversion rate:", error);
    }
  };

  const convertCurrency = () => {
    if (!amount || isNaN(amount)) {
      alert("Please enter a valid amount.");
      return;
    }

    const convertedValue = parseFloat(amount) * conversionRate;
    setConvertedAmount(convertedValue.toFixed(2));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Currency Converter</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={(text) => setAmount(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="From currency (e.g., USD)"
        value={fromCurrency}
        onChangeText={(text) => setFromCurrency(text.toUpperCase())}
      />
      <TextInput
        style={styles.input}
        placeholder="To currency (e.g., EUR)"
        value={toCurrency}
        onChangeText={(text) => setToCurrency(text.toUpperCase())}
      />
      <Button title="Convert" onPress={convertCurrency} />
      {conversionRate !== null && (
        <Text style={styles.result}>
          {amount} {fromCurrency} is equal to {convertedAmount} {toCurrency}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: "100%",
  },
  result: {
    marginTop: 20,
    fontSize: 18,
  },
});

export default CurrencyConverter;
