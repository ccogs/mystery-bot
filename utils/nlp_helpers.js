module.exports = {
    firstEntity:function(nlp, name) {
	    return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
	}
}