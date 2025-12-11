import React, { useEffect, useState, useRef } from 'react';

// Fix for TypeScript errors with Google Maps
declare global {
  interface Window {
    google: any;
  }
}
declare var google: any;

// --- DATA STRUCTURES ---

const collectionPoints = [
  {
    id: 1,
    name: "Cooperativa Vila Mariana",
    type: "cooperative",
    address: "Rua Domingos de Morais, 2187 - Vila Mariana, São Paulo - SP",
    location: { lat: -23.5881, lng: -46.6383 },
    acceptedMaterials: ["plastic", "glass", "metal", "paper"],
    specialMaterials: [],
    hours: "Seg-Sex: 8h-17h, Sáb: 8h-12h",
    phone: "(11) 5571-1234",
    contact: "João Silva",
    description: "Cooperativa familiar com 8 trabalhadores. Aceita todos os materiais recicláveis básicos. Faça a diferença na vida de famílias reais!",
    rating: 4.7,
    photo: "🦭",
    verified: true
  },
  {
    id: 2,
    name: "Ponto de Coleta Eletrônicos - Shopping Center",
    type: "electronics",
    address: "Av. Paulista, 1230 - Bela Vista, São Paulo - SP",
    location: { lat: -23.5629, lng: -46.6544 },
    acceptedMaterials: [],
    specialMaterials: ["electronics", "batteries", "small_appliances"],
    hours: "Diariamente: 10h-22h",
    phone: "(11) 3251-5678",
    contact: "Central de Atendimento",
    description: "Ponto de coleta especializado em eletrônicos, pilhas, baterias e pequenos eletrodomésticos. Destino correto para e-lixo!",
    rating: 4.9,
    photo: "⚡",
    verified: true
  },
  {
    id: 3,
    name: "EcoPonto Jardins",
    type: "ecopoint",
    address: "Rua Augusta, 2690 - Cerqueira César, São Paulo - SP",
    location: { lat: -23.5619, lng: -46.6608 },
    acceptedMaterials: ["plastic", "glass", "metal", "paper", "organic"],
    specialMaterials: ["electronics", "batteries", "oil", "lamps"],
    hours: "24 horas (self-service)",
    phone: "(11) 3061-9000",
    contact: "Prefeitura de São Paulo",
    description: "Ecoponto municipal com containers para múltiplos materiais. Aceita quase tudo! Disponível 24h para sua conveniência.",
    rating: 4.5,
    photo: "♻️",
    verified: true
  },
  {
    id: 4,
    name: "Cooperleste - Zona Leste",
    type: "cooperative",
    address: "Av. Aricanduva, 5555 - Vila Matilde, São Paulo - SP",
    location: { lat: -23.5523, lng: -46.5271 },
    acceptedMaterials: ["plastic", "glass", "metal", "paper", "cardboard"],
    specialMaterials: [],
    hours: "Seg-Sex: 7h-16h",
    phone: "(11) 2742-3456",
    contact: "Maria Santos",
    description: "Cooperativa atende Zona Leste de SP. 15 famílias dependem dessa coleta. Seu descarte correto gera renda real!",
    rating: 4.6,
    photo: "🦭",
    verified: true
  },
  {
    id: 5,
    name: "Farmácia Verde - Descarte de Medicamentos",
    type: "pharmacy",
    address: "Rua da Consolação, 3000 - Consolação, São Paulo - SP",
    location: { lat: -23.5489, lng: -46.6607 },
    acceptedMaterials: [],
    specialMaterials: ["medicines", "syringes", "medical_waste"],
    hours: "Seg-Sáb: 8h-22h, Dom: 9h-18h",
    phone: "(11) 3256-7890",
    contact: "Atendimento",
    description: "Descarte seguro de medicamentos vencidos, seringas e resíduos médicos domésticos. Evite contaminação ambiental!",
    rating: 4.8,
    photo: "💊",
    verified: true
  }
];

const materialIcons: Record<string, string> = {
  cooperative: "🦭",
  electronics: "⚡",
  ecopoint: "♻️",
  pharmacy: "💊",
  default: "📍"
};

const markerColors: Record<string, string> = {
  cooperative: "#0F8F6D",    // Teal
  electronics: "#7A3EB1",    // Purple
  ecopoint: "#5FD45E",        // Light Green
  pharmacy: "#4A1A71",        // Dark Purple
  default: "#0B4639"          // Petrol Green
};

// --- HELPER FUNCTIONS ---

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// --- COMPONENT ---

const MapLocator: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [userMarker, setUserMarker] = useState<any | null>(null);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [userLocation, setUserLocation] = useState({ lat: -23.5505, lng: -46.6333 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoint, setSelectedPoint] = useState<any | null>(null);
  const [loadingMsg, setLoadingMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [nearestNotification, setNearestNotification] = useState<any[] | null>(null);

  // Initialize Map
  useEffect(() => {
    // Check if Google Maps is loaded
    if (window.google && window.google.maps && mapRef.current && !map) {
      const initialMap = new window.google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 13,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true
      });

      const initialUserMarker = new window.google.maps.Marker({
        position: userLocation,
        map: initialMap,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#4A1A71",
          fillOpacity: 1,
          strokeColor: "white",
          strokeWeight: 3
        },
        title: "Sua Localização"
      });

      setMap(initialMap);
      setUserMarker(initialUserMarker);
    }
  }, [mapRef, map]);

  // Handle markers when filter or map changes
  useEffect(() => {
    if (!map) return;

    // Clear existing
    markers.forEach(marker => marker.setMap(null));
    
    const filteredPoints = currentFilter === 'all' 
      ? collectionPoints 
      : collectionPoints.filter(p => p.type === currentFilter);
    
    const newMarkers = filteredPoints.map(point => {
      const color = markerColors[point.type] || markerColors.default;
      const icon = materialIcons[point.type] || materialIcons.default;
      
      // Create SVG data URI for custom marker
      const svg = `
        <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="${color}" stroke="white" stroke-width="3"/>
          <text x="20" y="28" text-anchor="middle" font-size="20">${icon}</text>
        </svg>
      `;
      const url = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

      const marker = new window.google.maps.Marker({
        position: point.location,
        map: map,
        title: point.name,
        icon: {
          url: url,
          scaledSize: new window.google.maps.Size(40, 40)
        }
      });

      marker.addListener('click', () => {
        setSelectedPoint(point);
        map.setCenter(point.location);
        map.setZoom(15);
      });

      return marker;
    });

    setMarkers(newMarkers);
  }, [map, currentFilter]);

  const handleSearch = () => {
    if (!searchQuery) {
      setErrorMsg("Digite um endereço para buscar.");
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    setLoadingMsg("Buscando endereço...");
    
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery + ", Brazil" }, (results: any, status: any) => {
      setLoadingMsg(null);
      
      if (status === 'OK' && results && results[0]) {
        const newLocation = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };
        
        setUserLocation(newLocation);
        map?.setCenter(newLocation);
        userMarker?.setPosition(newLocation);
        
        showNearestPoints(newLocation);
      } else {
        setErrorMsg("Endereço não encontrado. Tente novamente.");
        setTimeout(() => setErrorMsg(null), 3000);
      }
    });
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      setLoadingMsg("Obtendo sua localização...");
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setUserLocation(newLocation);
          map?.setCenter(newLocation);
          userMarker?.setPosition(newLocation);
          
          setLoadingMsg(null);
          showNearestPoints(newLocation);
        },
        (error) => {
          setLoadingMsg(null);
          setErrorMsg("Não foi possível obter sua localização. Verifique as permissões.");
          setTimeout(() => setErrorMsg(null), 3000);
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setErrorMsg("Geolocalização não suportada pelo seu navegador.");
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const showNearestPoints = (location: { lat: number, lng: number }) => {
    const nearest = collectionPoints
      .map(point => ({
        ...point,
        distance: calculateDistance(location.lat, location.lng, point.location.lat, point.location.lng)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
    
    setNearestNotification(nearest);
    setTimeout(() => setNearestNotification(null), 8000);
  };

  const filteredPointsList = (currentFilter === 'all' 
    ? collectionPoints 
    : collectionPoints.filter(p => p.type === currentFilter))
    .map(point => ({
      ...point,
      distance: calculateDistance(userLocation.lat, userLocation.lng, point.location.lat, point.location.lng)
    }))
    .sort((a, b) => a.distance - b.distance);

  return (
    <div className="map-container px-4 py-6 pb-24">
      
      {/* Messages */}
      {loadingMsg && <div className="loading-message">{loadingMsg}</div>}
      {errorMsg && <div className="error-message">{errorMsg}</div>}
      
      {/* Nearest Toast */}
      {nearestNotification && (
        <div className="nearest-toast rounded-xl shadow-lg fixed top-20 left-1/2 transform -translate-x-1/2 z-[60] min-w-[300px] animate-fade-in">
          <h3>📍 Pontos Mais Próximos</h3>
          {nearestNotification.map((p, i) => (
            <div key={i} className="nearest-item">
              <strong>{p.photo} {p.name}</strong>
              <p>{p.distance.toFixed(1)}km de distância</p>
            </div>
          ))}
        </div>
      )}

      <div className="map-header">
        <h2>🗺️ Pontos de Coleta</h2>
        <p>Encontre onde descartar corretamente</p>
      </div>

      <div className="map-filters">
        <button 
          className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`} 
          onClick={() => setCurrentFilter('all')}
        >
          Todos
        </button>
        <button 
          className={`filter-btn ${currentFilter === 'cooperative' ? 'active' : ''}`} 
          onClick={() => setCurrentFilter('cooperative')}
        >
          🦭 Cooperativas
        </button>
        <button 
          className={`filter-btn ${currentFilter === 'electronics' ? 'active' : ''}`} 
          onClick={() => setCurrentFilter('electronics')}
        >
          ⚡ Eletrônicos
        </button>
        <button 
          className={`filter-btn ${currentFilter === 'ecopoint' ? 'active' : ''}`} 
          onClick={() => setCurrentFilter('ecopoint')}
        >
          ♻️ Ecopontos
        </button>
        <button 
          className={`filter-btn ${currentFilter === 'pharmacy' ? 'active' : ''}`} 
          onClick={() => setCurrentFilter('pharmacy')}
        >
          💊 Medicamentos
        </button>
      </div>

      <div className="search-box">
        <input 
          type="text" 
          placeholder="Digite seu endereço..." 
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch} className="search-btn">
          🔍 Buscar
        </button>
        <button onClick={handleUseMyLocation} className="location-btn">
          📍 Localização
        </button>
      </div>

      <div 
        id="map" 
        ref={mapRef} 
        style={{ width: '100%', height: '400px', borderRadius: '16px', marginBottom: '20px' }}
      ></div>

      <div className="points-list">
        <h3>Lista de Pontos</h3>
        <div id="pointsListContent">
          {filteredPointsList.map(point => (
            <div 
              key={point.id} 
              className="point-list-item" 
              onClick={() => {
                setSelectedPoint(point);
                map?.setCenter(point.location);
                map?.setZoom(15);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="point-icon" style={{ background: markerColors[point.type] }}>
                {materialIcons[point.type]}
              </div>
              <div className="point-info">
                <h4>{point.name}</h4>
                <p className="point-address">{point.address}</p>
                <p className="point-distance">📍 {point.distance.toFixed(1)}km de você</p>
                <div className="point-materials">
                  {point.acceptedMaterials.length > 0 && (
                    <span className="material-tag">Aceita: {point.acceptedMaterials.slice(0, 3).join(', ')}{point.acceptedMaterials.length > 3 ? '...' : ''}</span>
                  )}
                  {point.specialMaterials.length > 0 && (
                    <span className="material-tag special">Especial: {point.specialMaterials[0]}</span>
                  )}
                </div>
                <div className="point-rating">
                  ⭐ {point.rating} {point.verified ? '✓' : ''}
                </div>
              </div>
              <div className="point-arrow">→</div>
            </div>
          ))}
        </div>
      </div>

      <div className="map-legend">
        <h4>Legenda:</h4>
        <div className="legend-items">
          <div className="legend-item"><span style={{ color: '#0F8F6D' }}>🦭</span> Cooperativa</div>
          <div className="legend-item"><span style={{ color: '#7A3EB1' }}>⚡</span> Eletrônicos</div>
          <div className="legend-item"><span style={{ color: '#5FD45E' }}>♻️</span> Ecoponto</div>
          <div className="legend-item"><span style={{ color: '#4A1A71' }}>💊</span> Medicamentos</div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPoint && (
        <div className="point-modal animate-fade-in" onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedPoint(null);
        }}>
          <div className="point-modal-content animate-slide-up">
            <button className="close-modal" onClick={() => setSelectedPoint(null)}>×</button>
            
            <div className="point-detail-header" style={{ background: `linear-gradient(135deg, ${markerColors[selectedPoint.type]}, ${markerColors.default})` }}>
              <div className="point-detail-icon">{materialIcons[selectedPoint.type]}</div>
              <h2>{selectedPoint.name}</h2>
              <p>📍 Selecionado no mapa</p>
            </div>
            
            <div className="point-detail-body">
              <div className="detail-section">
                <h3>📍 Endereço</h3>
                <p>{selectedPoint.address}</p>
              </div>
              
              <div className="detail-section">
                <h3>🕐 Horário</h3>
                <p>{selectedPoint.hours}</p>
              </div>
              
              <div className="detail-section">
                <h3>📞 Contato</h3>
                <p>{selectedPoint.phone}</p>
                <p>{selectedPoint.contact}</p>
              </div>
              
              <div className="detail-section">
                <h3>ℹ️ Sobre</h3>
                <p>{selectedPoint.description}</p>
              </div>

              <div className="detail-actions">
                <button 
                  className="btn" 
                  style={{ background: '#0F8F6D' }}
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${selectedPoint.location.lat},${selectedPoint.location.lng}&travelmode=driving`;
                    window.open(url, '_blank');
                  }}
                >
                  🗺️ Como Chegar
                </button>
                <button 
                  className="btn" 
                  style={{ background: '#7A3EB1' }}
                  onClick={() => window.location.href = `tel:${selectedPoint.phone.replace(/\D/g, '')}`}
                >
                  📞 Ligar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MapLocator;