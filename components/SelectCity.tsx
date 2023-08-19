import React, { ChangeEvent, useEffect, useState } from "react";

import { City } from "@/types/geo-types";
import { Route } from "@/types/routes";

import SelectDropdown from "./SelectDropdown";

type GetCities = (type?: string, value?: string | number) => Promise<City | City[] | []>;

const getCities: GetCities = async (type, value) => {
	return await fetch(`${Route.api.cities}${type && value ? `/${type}/${value}` : ""}`).then((res) =>
		res.json()
	);
};

type Props = {
	defaultCityName?: string;
	defaultCountryCode?: string;
	defaultCountryId?: number;
	className?: string;
	onChange?: (entry: City) => void;
	onTextChange?: (entry: ChangeEvent<HTMLInputElement>) => void;
	placeHolder?: string;
};

const SelectCity: React.FC<Props> = ({
	defaultCityName,
	defaultCountryCode,
	defaultCountryId,
	className,
	onChange,
	onTextChange,
	placeHolder = "Select city",
}) => {
	const [cities, setCities] = useState<City[]>([]);
	const [defaultOption, setDefaultOption] = useState<City>();

	useEffect(() => {
		// We doesn't support other types of city list choices yet
		if (defaultCountryId) {
			if (1 <= defaultCountryId && defaultCountryId <= 250) {
				getCities("id_flat", defaultCountryId).then((data) => {
					setCities(data as City[]);
				});
			}
		} else if (defaultCountryCode) {
			getCities("code_flat", defaultCountryCode).then((data) => {
				setCities(data as City[]);
			});
		}
	}, [defaultCountryCode, defaultCountryId]);

	useEffect(() => {
		if (defaultCityName) {
			const city = cities.find((city) => city.name === defaultCityName);

			if (city) {
				setDefaultOption(city);
			}
		}
	}, [cities, defaultCityName]);

	useEffect(() => {
		if (typeof onChange === "function" && defaultOption) {
			onChange(defaultOption);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [defaultOption]);

	return (
		<SelectDropdown
			className={className}
			defaultOption={defaultOption}
			options={cities}
			placeHolder={placeHolder}
			showFlag={false}
			onChange={(value) => {
				if (onChange) {
					onChange(value as City);
				}
			}}
			onTextChange={onTextChange}
		/>
	);
};

export default SelectCity;
