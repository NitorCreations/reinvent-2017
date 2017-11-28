export const CATEGORIES = {
	'Geo': 'Geophysical (inc. landslide)',
	'Met': 'Meteorological (inc. flood)',
	'Safety': 'General emergency and public safety',
	'Security': 'Law enforcement, military, homeland and local/private security',
	'Rescue': 'Rescue and recovery',
	'Fire': 'Fire suppression and rescue',
	'Health': 'Medical and public health',
	'Env': 'Pollution and other environmental',
	'Transport': 'Public and private transportation',
	'Infra': 'Utility, telecommunication, other non-transport infrastructure',
	'CBRNE': 'Chemical, Biological, Radiological, Nuclear or High-Yield Explosive threat or attack',
	'Other': 'Other events',
}

export const SEVERITIES = {
	'Extreme': 'Extraordinary threat to life or property',
	'Severe' : 'Significant threat to life or property',
	'Moderate': 'Possible threat to life or property',
	'Minor' : 'Minimal to no known threat to life or property',
	'Unknown' : 'Severity unknown',
}

export const URGENCIES = {
	'Immediate': 'Immediate - Responsive action SHOULD be taken immediately',
	'Expected': 'Expected - Responsive action SHOULD be taken soon (within next hour)',
	'Future': 'Future - Responsive action SHOULD be taken in the near future',
	'Past': 'Past - Responsive action is required no longer',
	'Unknown': 'Unknown - Urgency not known',
}

export const CERTAINTIES = {
	'Observed': 'Determined to have occurred or to be ongoing',
	'Likely': 'Likely (p > ~50%)',
	'Possible': 'Possible but not likely (p <= ~50%)',
	'Unlikely': 'Not expected to occur (p ~ 0)',
	'Unknown': 'Certainty unknown',
}

