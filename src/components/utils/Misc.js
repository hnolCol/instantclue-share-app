
import _ from "lodash"

export function openURL (url) {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer")
    if (newWindow) {
        newWindow.opener = null

    }
}

const euclDistance = function(p1,p2,accX,accY){
    return Math.sqrt(Math.pow(p1[accX] - p2[accX], 2) + Math.pow(p1[accY] - p2[accY], 2))
}

export function findClosestMatch(p,points,accX,accY,minDistX,minDistY){
    // console.log(p,accX,accY)
    // console.log(points)
    // console.log(euclDistance(p,points[0],accX,accY))
    var distanceToPoints = _.map(points,function(v) {return euclDistance(p,v,accX,accY)})
    let minIdx = distanceToPoints.indexOf(Math.min(...distanceToPoints));
    return minIdx
}


export function Mailto({email, subject, body, children}){
    return (
      <a href={`mailto:${email}?subject=${encodeURIComponent(subject) || ''}&body=${encodeURIComponent(body) || ''}`}>{children}</a>
    );
  };