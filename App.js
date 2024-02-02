import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [conversionRate, setConversionRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConversionRate();
  }, [fromCurrency, toCurrency]);

  const fetchConversionRate = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiKey = "YOUR_OPENEXCHANGERATES_API_KEY"; // Replace with your API key
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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching conversion rate:", error);
      setError("Error fetching conversion rate. Please try again.");
      setLoading(false);
    }
  };

  const convertCurrency = () => {
    if (!amount || isNaN(amount)) {
      alert("Please enter a valid amount.");
      return;
    }

    if (conversionRate === null) {
      alert("Please wait while fetching conversion rate.");
      return;
    }

    const convertedValue = (parseFloat(amount) * conversionRate).toFixed(2);
    setConvertedAmount(convertedValue);
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

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {error && <Text style={styles.error}>{error}</Text>}

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
    fontWeight: "bold",
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
  error: {
    color: "red",
    marginTop: 10,
  },
});

export default CurrencyConverter;
