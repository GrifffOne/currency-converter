import { useEffect, useRef, useState } from 'react'
import { Converter } from './converter/Converter'

function Home() {
	const [fromCurrency, setFromCurrency] = useState('RUB')
	const [toCurrency, setToCurrency] = useState('USD')

	const [fromPrice, setFromPrice] = useState(0)
	const [toPrice, setToPrice] = useState(0)

	const rateRef = useRef({})

	async function getCurrencies() {
		try {
			const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js')

			const data = await response.json()
			rateRef.current = data.Valute
			rateRef.current.RUB = { Value: 1 }
			onChangeFromPrice(1)
			console.log(rateRef.current)
		} catch (error) {
			console.warn(error)
			alert('Данные не получены!')
		}
	}

	useEffect(() => {
		getCurrencies()
	}, [])

	const onChangeFromPrice = (value) => {
		if (value === 0) return
		const price = value / rateRef.current[fromCurrency].Value
		const result = price * rateRef.current[toCurrency].Value
		setFromPrice(value)
		setToPrice(result.toFixed(3))
	}

	const onChangeToPrice = (value) => {
		if (value === 0) return
		const result =
			(rateRef.current[fromCurrency].Value /
				rateRef.current[toCurrency].Value) *
			value
		setFromPrice(result.toFixed(3))
		setToPrice(value)
	}

	useEffect(() => {
		onChangeToPrice(toPrice)
	}, [fromCurrency])

	useEffect(() => {
		onChangeFromPrice(fromPrice)
	}, [toCurrency])

	return (
		<div className='App'>
			<Converter
				value={fromPrice}
				currency={fromCurrency}
				onChangeValue={onChangeFromPrice}
				onChangeCurrency={setFromCurrency}
			/>
			<Converter
				value={toPrice}
				currency={toCurrency}
				onChangeValue={onChangeToPrice}
				onChangeCurrency={setToCurrency}
			/>
		</div>
	)
}

export default Home
