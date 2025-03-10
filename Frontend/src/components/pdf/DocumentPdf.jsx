import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles } from './StylePdf';
import { CFUtoH, unitCFU } from '../../../ConfigClient';

function DocumentPdf(props){
    // restituisce l'elenco delle aree, id e nome, che l'insegnamento copre
    const getAreePerInsegnamento = (sottoareeIns) => {
        const idsAree = sottoareeIns.map(sottoarea => sottoarea.area); // elenco idArea che contiene un insegnamento
        const areeFiltrate = props.aree.filter(area => idsAree.includes(area.id));
        let areeResult = [];
        for(let area of areeFiltrate){
            let sum = 0;
            for(let sottoarea of sottoareeIns) if(area.id == sottoarea.area) sum += sottoarea.ore
            if(sum > 0) areeResult.push({...area, oretot: sum});
        }
        return areeResult;
    }

    const getAreePerAnno = (anno) => {
        let areeMap = new Map(); // hash map che contiene le aree con le oretot per ogni anno
        for(let area of props.aree) areeMap.set(area.id, {...area, oretot: 0}); // carico la hash map con tutte le aree a zero
        const insAnno = props.insegnamenti.filter(ins => ins.annoerogazione == anno); // contiene tutti gli insegnamenti per un determinato anno 
        for(let ins of insAnno){
            let areeIns = getAreePerInsegnamento(ins.sottoaree);
            for(let areaIns of areeIns){
                let getArea = areeMap.get(areaIns.id)
                if(!getArea) areeMap.set(areaIns.id, areaIns);
                else areeMap.set(areaIns.id, {...getArea, oretot: getArea.oretot+areaIns.oretot});
            }
        }
        return Array.from(areeMap.values());
    }

    const getSottoareePerAnno = (anno) => {
        let sottoareeMap = new Map(); // hash map che contiene le sottoaree con le oretot per ogni anno
        for(let sottoarea of props.sottoaree) sottoareeMap.set(sottoarea.id, {...sottoarea, oretot: 0}); // carico la hash map con tutte le sottoaree a zero
        const insAnno = props.insegnamenti.filter(ins => ins.annoerogazione == anno); // contiene tutti gli insegnamenti per un determinato anno
        for(let ins of insAnno){
            for(let insSottoarea of ins.sottoaree){
                // per ogni sottoarea aggiungo alla somma già presente nella hash map
                let getSottoarea = sottoareeMap.get(insSottoarea.id);
                if(getSottoarea) sottoareeMap.set(insSottoarea.id, {...getSottoarea, oretot: getSottoarea.oretot+insSottoarea.ore});
            }
        }
        return Array.from(sottoareeMap.values());
    }
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>Riepilogo Regolamento</Text>
                <View style={styles.section}>
                    <Text style={styles.titleSection}>Informazioni università:</Text>
                    <Text style={styles.content}>Corso di studio: {props.regolamento.corsodistudio}</Text>
                    <Text style={styles.content}>Regolamento didattico AA: {props.regolamento.annoaccademico}</Text>
                    <Text style={styles.content}>Durata: {props.regolamento.duratacorso}</Text>
                    <Text style={styles.content}>Stato richiesta: {props.regolamento.richiesta == null ? " Nessuna richiesta presente " : " "+props.regolamento.stato}</Text>
                    <Text style={styles.content}>Presidente: {props.presidente.nome} {props.presidente.cognome} ({props.presidente.email})</Text>
                </View>
                {/* vista che contiene l'elenco degli insegnamenti e per ogni insegnamento l'elenco delle aree coperte e per ognuna le sottoaree */}
                <View style={styles.section}>
                    <Text style={styles.titleSection}>Riepilogo Insegnamenti:</Text>
                    {props.anni.map((anno, keyAnno) => (
                        <View key={keyAnno} style={styles.section}>
                            <Text key={keyAnno} style={styles.subtitleSection}>{anno} ANNO</Text>
                            {props.insegnamenti.filter(ins => ins.annoerogazione == anno).map((insegnamento, keyIns) => (
                                <View key={keyIns} style={styles.section}>
                                    <Text key={keyIns} style={styles.content}>
                                        {insegnamento.nome} ({unitCFU ? `${parseInt(insegnamento.oretot)/CFUtoH} CFU` : `${insegnamento.oretot}h`}, {insegnamento.settore})
                                    </Text>
                                    {getAreePerInsegnamento(insegnamento.sottoaree).map((area, keyArea) => (
                                        <View key={keyArea} style={[styles.list, styles.section]}>
                                            <Text key={keyArea} style={styles.elementList}>• {area.nome}: {unitCFU ? `${parseInt(area.oretot)/CFUtoH} CFU` : `${area.oretot}h`}</Text>
                                            {insegnamento.sottoaree.filter(sottoarea => sottoarea.area == area.id).map((sottoarea, keySottoarea) => (
                                                <View key={keySottoarea} style={styles.list}>
                                                    <Text key={keySottoarea} style={styles.elementChildList}>- {sottoarea.nome}: {unitCFU ? `${parseInt(sottoarea.ore)/CFUtoH} CFU` : `${sottoarea.ore}h`}</Text>
                                                </View>
                                            ))}
                                        </View>

                                    ))}
                                </View>
                            ))}
                        </View>


                    ))}
                </View>

                {/* vista che contiene l'elenco delle aree e sottoaree diviso per anni */}
                <View style={styles.section}>
                    <Text style={styles.titleSection}>Riepilogo Anni:</Text>
                    {props.anni.map((anno, keyAnno) => (
                        <View key={keyAnno} style={styles.section}>
                            <Text key={keyAnno} style={styles.subtitleSection}>{anno} ANNO</Text>
                            {getAreePerAnno(anno).map((area, keyArea) => (
                                <View key={keyArea} style={[styles.list, styles.section]}>
                                    <Text key={keyArea} style={styles.elementList}>• {area.nome}: {unitCFU ? `${parseInt(area.oretot)/CFUtoH} CFU` : `${area.oretot}h`}</Text>
                                    {getSottoareePerAnno(anno).filter(sottoarea => sottoarea.area == area.id).map((sottoarea, keySottoarea) => (
                                        <View key={keySottoarea} style={styles.list}>
                                            <Text key={keySottoarea} style={styles.elementChildList}>- {sottoarea.nome}: {unitCFU ? `${parseInt(sottoarea.oretot)/CFUtoH} CFU` : `${sottoarea.oretot}h`}</Text>
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            </Page>
        </Document>)
}
export default DocumentPdf;