export default function Modelizer(It) {
    It.prototype.cast = function(it, path, fallback='') {
        let ar = path.split('.')
        if(!it)
            return fallback;

        if(ar.length>0 && (ar[0] in it)) {
            let base = it[ar[0]]
            if(base && ar.length>1) {
                for(var i=1; i<ar.length; i++) {
                    if(base && (ar[i] in base))
                        base = base[ar[i]]
                    else
                        return fallback
                }
            }
            if(base!==null)
                return base
        }

        return fallback
    }

    It.prototype.descend = function(it, path, value) {
        if(!it)
            it = {}
        let base = it
        let ar = path.split('.')
        if(ar.length>0) {
            for(var i=0; i<ar.length; i++) {
                if(base && !(ar[i] in base)) {
                    base[ar[i]] = {}
                    base = base[ar[i]]
                }
            }
        }
        base = value
    }

    It.prototype.models = function(path, fallback=''){
        return this.cast(this, path, fallback);
    }
    return It
}