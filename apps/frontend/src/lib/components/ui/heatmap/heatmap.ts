export const getLastMonday = (start: Date) => {
	const diff = (start.getDay() + 6) % 7;
	start.setDate(start.getDate() - diff);
	return start;
};

export const getColor = (colors: string[], max: number, value: number) => {
	if (!value) return colors[0];
	const p = (value / max) * (colors.length - 1);
	return colors[Math.ceil(p)];
};

export const getCalendar = (data: { [key: string]: number }, year: number) => {
	const base = getLastMonday(new Date(year, 0, 1));

	let max = 0;
	const calendar = Array.from({ length: 7 }, (_, i) => {
		const start = new Date(base);
		start.setDate(start.getDate() + i);
		return Array.from({ length: 53 }, (_, j) => {
			const day = new Date(start);
			day.setDate(start.getDate() + j * 7);
			if (day.getFullYear() == year) {
				const date = day.toISOString().split('T')[0];
				const value = data[date] ?? 0;
				if (value > max) {
					max = value;
				}
				return { date, value };
			}
		});
	});

	return { calendar, max };
};

export type Props = {
	data: { [key: string]: { [key: string]: number } };
	dataName: string;
	year?: number;
	lday?: boolean;
	lmonth?: boolean;
	colors?: string[];
	cellSize?: number;
	className?: string;
};
