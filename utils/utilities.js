const STATUS_COLOR_MAP = {
	NE: '#4B5563', // Gris 600
	DD: '#374151', // Gris 700
	LC: '#15803D', // Verde 700
	NT: '#A16207', // Ámbar 700
	VU: '#C2410C', // Naranja 700
	EN: '#B91C1C', // Rojo 700
	CR: '#7F1D1D', // Rojo 900
	EW: '#5B21B6', // Púrpura 700
	EX: '#0B0F19'  // Casi negro
}

export const parseNumber = v => v == null ? undefined : Number(v)
export const parseArray = v => Array.isArray(v) ? v : (typeof v === 'string' ? v.split(',').map(s => s.trim()).filter(Boolean) : [])

export const getStatusColor = (abbreviation) => {
	if (!abbreviation) return STATUS_COLOR_MAP.DD

	const key = abbreviation.toUpperCase()
	return STATUS_COLOR_MAP[key] ?? STATUS_COLOR_MAP.DD
}
