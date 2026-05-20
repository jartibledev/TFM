import { useRouter, useParams } from 'next/navigation';



function LinkComponent () {
    const router = useRouter(); 
    const params = useParams();
     const handleStartNavigation = () => {
        const currentLocale = params?.locale || 'es'; // 'es' como fallback si no se detecta
        router.push(`/${currentLocale}/home_page`);
    };

    return (
                <div 
                        style={{ margin: 'auto', display: 'flex', cursor: 'pointer' }} 
                        onClick={handleStartNavigation}
                    ></div>
                
                )
}
export default LinkComponent;
