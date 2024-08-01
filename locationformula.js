function helper(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const lat1Rad = toRadians(lat1);
    const lon1Rad = toRadians(lon1);
    const lat2Rad = toRadians(lat2);
    const lon2Rad = toRadians(lon2);
    const distanceKm = Math.acos(
        Math.sin(lat1Rad) * Math.sin(lat2Rad) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.cos(lon2Rad - lon1Rad)
    ) * R;
    const distanceMeters = distanceKm * 1000;
    
    return distanceMeters;
}
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
const distance = calculateDistance(52.52, 13.405, 51.507, -0.127);
console.log('Distance:', distance.toFixed(2), 'meters');