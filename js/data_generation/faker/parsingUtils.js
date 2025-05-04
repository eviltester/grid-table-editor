function removeStartAndEnd(start, end, from){
    if(from.startsWith(start,0) && from.endsWith(end)){
        return from.substr(1,from.length-2);
    }
    return from;
}

export { removeStartAndEnd };