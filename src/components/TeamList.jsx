import { useState, useEffect } from 'react';

export default function TeamList() {
    const [staffData, setStaffData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCards, setExpandedCards] = useState({});

    const toggleCard = (id) => {
        setExpandedCards(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const customInfo = {
        '946098490654740580': {
            roles: ["Propriétaire", "Gérant", "Développeur", "Designeur", "Hébergeur"],
            desc: "Passionné par le développement de bots Discord et l'optimisation des performances.",
            social: [
                { icon: "fab fa-discord", url: "https://discord.gg/RZHrtzwUC2", title: "Discord" },
                { icon: "fab fa-github", url: "https://github.com/Xougui", title: "GitHub" }
            ]
        },
        '1178647820052467823': {
            roles: ["Gérant", "Développeur"],
            desc: "Développeur passionné, il gère entièrement Alt F4, son bot.",
            social: [
                { icon: "fab fa-github", url: "https://github.com/Kadawatcha", title: "GitHub" },
                { icon: "fab fa-discord", url: "https://discord.gg/2B53yNdWPG", title: "Discord" }
            ]
        },
        '1223319413760200804': {
            roles: ["Gérant Blacklist"],
            desc: "Chargé de la gestion de la Blacklist, il œuvre pour un Discord plus sain.",
            social: [
                { icon: "fab fa-youtube", url: "https://www.youtube.com/@Dogday_nap", title: "YouTube" }
            ]
        },
        '1516121157806588144': {
            roles: ["Gérant Blacklist"],
            desc: "Il gère la Blacklist.",
            social: [
                { icon: "fab fa-discord", url: "https://discord.gg/HM2gE5f52b", title: "Discord" },
                { icon: "fab fa-github", url: "https://github.com/PhantomX-Bs", title: "GitHub" }
            ]
        },
        '1259142127875657759': {
            roles: ["Gérant Blacklist"],
            desc: "Il aime un peu trop le fromage... Mais vous inquiétez pas, il gère la Blacklist avec sérieux !",
            social: []
        },
        '1402631368806109255': {
            roles: ["Gérant Community Manager"],
            desc: "Il se consacre à accroître la visibilité de Lyxios.",
            social: []
        },
        '1421504705535803463': {
            roles: ["Gérant Community Manager"],
            desc: "Il aide également à la visibilité et à la gestion de la communauté Lyxios.",
            social: []
        }
    };

    useEffect(() => {
        const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
        const apiUrl = isLocal 
            ? 'http://127.0.0.1:25002/api/v1/staff' 
            : 'https://api-lyxios.xouxou-hosting.fr/api/v1/staff';

        fetch(apiUrl)
            .then((res) => res.ok ? res.json() : Promise.reject(`Erreur HTTP ${res.status}`))
            .then((data) => {
                if (Array.isArray(data)) {
                    setStaffData(data);
                } else if (data.status === 'success' && Array.isArray(data.staff)) {
                    setStaffData(data.staff);
                } else {
                    console.warn('⚠️ API Staff : Format de réponse inattendu.', data);
                    setStaffData([]);
                }
                setLoading(false);
            })
            .catch((e) => {
                console.error('Erreur lors de la récupération du staff:', e);
                setError(true);
                setLoading(false);
            });
    }, []);

    const getRoleIndex = (memberId) => {
        const roleOrder = [
            "Propriétaire", "Gérant", "Développeur", "Gérant Community Manager", "Gérant Blacklist",
            "Community Manager", "Hébergeur", "Designeur",
        ];
        const info = customInfo[memberId];
        if (!info || !info.roles || info.roles.length === 0) return roleOrder.length;

        const indices = info.roles.map(role => {
            const index = roleOrder.indexOf(role);
            return index === -1 ? roleOrder.length : index;
        });
        return Math.min(...indices);
    };

    const sortedStaff = [...staffData].sort((a, b) => {
        if (String(a.id) === '946098490654740580') return -1;
        if (String(b.id) === '946098490654740580') return 1;
        if (String(a.id) === '1178647820052467823') return -1;
        if (String(b.id) === '1178647820052467823') return 1;

        const roleIndexA = getRoleIndex(String(a.id));
        const roleIndexB = getRoleIndex(String(b.id));

        if (roleIndexA !== roleIndexB) return roleIndexA - roleIndexB;
        return (a.display_name || a.name).localeCompare(b.display_name || b.name);
    });

    const getFilteredStaff = () => {
        return sortedStaff.filter(member => {
            const info = customInfo[String(member.id)] || {};
            const roles = info.roles || [];
            
            // Search text check
            const nameMatch = (member.display_name || member.name).toLowerCase().includes(searchQuery.toLowerCase());
            const descMatch = (info.desc || '').toLowerCase().includes(searchQuery.toLowerCase());
            const roleMatch = roles.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesSearch = nameMatch || descMatch || roleMatch;

            if (!matchesSearch) return false;

            // Tab filtering
            if (activeTab === 'all') return true;
            if (activeTab === 'direction') {
                return roles.includes("Propriétaire") || roles.includes("Gérant");
            }
            if (activeTab === 'dev') {
                return roles.includes("Développeur");
            }
            if (activeTab === 'moderation') {
                return roles.includes("Gérant Blacklist");
            }
            if (activeTab === 'communication') {
                return roles.includes("Gérant Community Manager") || roles.includes("Community Manager");
            }
            return true;
        });
    };

    const filteredStaffList = getFilteredStaff();

    const groups = [
        { id: 'direction', title: "Direction", check: (roles) => roles.includes("Propriétaire") || roles.includes("Gérant"), members: [] },
        { id: 'dev', title: "Développement", check: (roles) => roles.includes("Développeur"), members: [] },
        { id: 'équipe', title: "Équipe", check: (roles) => !roles.includes("Propriétaire") && !roles.includes("Gérant") && !roles.includes("Développeur"), members: [] }
    ];

    // Group members for the 'all' view when no search query is active
    const getGroupedMembers = () => {
        const staffGroups = groups.map(g => ({ ...g, members: [] }));
        filteredStaffList.forEach(member => {
            const info = customInfo[String(member.id)] || {};
            const roles = info.roles || [];
            for (const group of staffGroups) {
                if (group.check(roles)) {
                    group.members.push(member);
                    break; // Keep unique (no duplicate members)
                }
            }
        });
        return staffGroups;
    };

    const groupedStaff = getGroupedMembers();

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--sl-color-bg-nav)', borderRadius: '8px', marginTop: '1rem' }}><p>Chargement de l'équipe...</p></div>;
    if (error || sortedStaff.length === 0) return <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--sl-color-bg-nav)', borderRadius: '8px', marginTop: '1rem' }}><p>Impossible de charger la liste de l'équipe pour le moment.</p></div>;

    const renderStaffGrid = (members) => (
        <div className="staff-grid">
            {members.map((member) => {
                const info = customInfo[String(member.id)] || {};
                const isExpanded = !!expandedCards[member.id];
                return (
                    <div className="staff-card" key={member.id}>
                        <div className="staff-header">
                            <div className="staff-avatar-container">
                                <img src={member.avatar_url || 'https://cdn.discordapp.com/embed/avatars/0.png'} alt={member.display_name} className="staff-avatar" />
                                {member.avatar_decoration_url && <img src={member.avatar_decoration_url} alt="Decoration" className="staff-decoration" />}
                            </div>
                            <div className="staff-identity">
                                <div className="staff-name" title={member.display_name || member.name}>{member.display_name || member.name}</div>
                                {info.social && info.social.length > 0 && (
                                    <div className="staff-social">
                                        {info.social.map((s, i) => (
                                            <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" title={s.title}><i className={s.icon}></i></a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="staff-body">
                            {info.roles && (
                                <div className="staff-roles">
                                    {info.roles.slice(0, 2).map((role, index) => (
                                        <span key={index} className="staff-role-badge">{role}</span>
                                    ))}
                                    {info.roles.length > 2 && (
                                        <button 
                                            className={`staff-role-badge toggle-badge ${isExpanded ? 'expanded' : ''}`}
                                            onClick={() => toggleCard(member.id)}
                                        >
                                            {isExpanded ? 'Voir moins' : `+${info.roles.length - 2} autres...`}
                                        </button>
                                    )}
                                    {isExpanded && info.roles.slice(2).map((role, index) => (
                                        <span key={index + 2} className="staff-role-badge extra-badge">{role}</span>
                                    ))}
                                </div>
                            )}
                            {info.desc && <div className="staff-desc">{info.desc}</div>}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
            
            <style>{`
                .team-filters-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    padding: 1rem;
                    background-color: var(--sl-color-bg-nav);
                    border-radius: 12px;
                    border: 1px solid var(--sl-color-gray-5);
                    width: 100%;
                    box-sizing: border-box;
                }
                .team-tabs {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.35rem;
                }
                .desktop-only {
                    display: flex;
                }
                .mobile-only {
                    display: none;
                }
                .team-tab-btn {
                    padding: 0.5rem 1rem;
                    border-radius: 8px !important;
                    border: 1px solid transparent;
                    margin: 0 !important;
                    cursor: pointer;
                    font-weight: 600;
                    font-family: 'Outfit', sans-serif;
                    font-size: 0.9rem;
                    background-color: transparent;
                    color: var(--sl-color-text-accent);
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .team-tab-btn:hover {
                    background-color: rgba(80, 132, 95, 0.1);
                    color: var(--sl-color-text);
                }
                .team-tab-btn.active {
                    background-color: var(--color-lyxios-green-700);
                    color: #ffffff;
                    box-shadow: 0 4px 12px rgba(55, 106, 69, 0.25);
                }
                .team-tab-btn:focus-visible {
                    outline: 2px solid var(--color-lyxios-green-500);
                    outline-offset: 2px;
                }
                .team-mobile-select {
                    width: 100%;
                    padding: 0.5rem 2.5rem 0.5rem 1rem;
                    border-radius: 8px;
                    border: 1px solid var(--sl-color-gray-5);
                    background-color: var(--sl-color-bg);
                    color: var(--sl-color-text);
                    font-size: 0.9rem;
                    font-family: 'Outfit', sans-serif;
                    font-weight: 600;
                    outline: none;
                    cursor: pointer;
                    appearance: none;
                    transition: all 0.25s ease;
                }
                .team-mobile-select:focus {
                    border-color: var(--sl-color-accent);
                    box-shadow: 0 0 0 2px rgba(80, 132, 95, 0.15);
                }
                .team-select-wrapper {
                    position: relative;
                    width: 100%;
                    max-width: 300px;
                    margin: 0 !important;
                }
                .team-select-arrow {
                    position: absolute;
                    right: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--sl-color-text-accent);
                    font-size: 0.85rem;
                    pointer-events: none;
                    margin: 0 !important;
                    line-height: 1 !important;
                }
                .team-search-wrapper {
                    position: relative;
                    width: 100%;
                    max-width: 300px;
                    margin: 0 !important;
                }
                .team-search-input {
                    width: 100%;
                    padding: 0.5rem 1rem 0.5rem 2.25rem;
                    border-radius: 8px;
                    border: 1px solid var(--sl-color-gray-5);
                    background-color: var(--sl-color-bg);
                    color: var(--sl-color-text);
                    font-size: 0.9rem;
                    font-family: 'Roboto', sans-serif;
                    outline: none;
                    transition: all 0.25s ease;
                }
                .team-search-input:focus {
                    border-color: var(--sl-color-accent);
                    box-shadow: 0 0 0 2px rgba(80, 132, 95, 0.15);
                }
                .team-search-icon {
                    position: absolute;
                    left: 0.85rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--sl-color-gray-3);
                    font-size: 0.85rem;
                    pointer-events: none;
                }
                
                @media (max-width: 768px) {
                    .desktop-only {
                        display: none !important;
                    }
                    .mobile-only {
                        display: block !important;
                    }
                    .team-filters-container {
                        flex-direction: column;
                        align-items: center;
                        gap: 1rem;
                        padding: 0.75rem;
                    }
                    .team-select-wrapper {
                        max-width: 300px;
                        width: 100%;
                    }
                    .team-search-wrapper {
                        max-width: 300px;
                        width: 100%;
                    }
                }
                
                @media (max-width: 480px) {
                    .staff-card {
                        padding: 1rem !important;
                    }
                    .staff-header {
                        gap: 0.75rem !important;
                        padding-bottom: 0.75rem !important;
                    }
                    .staff-avatar-container {
                        width: 60px !important;
                        height: 60px !important;
                    }
                    .staff-name {
                        font-size: 1.15rem !important;
                    }
                    .staff-desc {
                        font-size: 0.9rem !important;
                    }
                }
                
                /* Hover card enhancements */
                .staff-card {
                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s ease, box-shadow 0.3s ease !important;
                    gap: 0.5rem !important;
                }
                .staff-card:hover {
                    transform: translateY(-6px) scale(1.01) !important;
                    box-shadow: 0 12px 24px -10px rgba(80, 132, 95, 0.3) !important;
                }
                
                /* Override negative margins and layout headers */
                .staff-header {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
                    margin-bottom: 0 !important;
                    padding-bottom: 0.5rem !important;
                }
                .staff-roles {
                    margin-top: 0 !important;
                    min-height: auto !important;
                    margin-bottom: 0 !important;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.4rem !important;
                }
                .staff-role-badge {
                    background-color: rgba(80, 132, 95, 0.08) !important;
                    border: 1px solid rgba(80, 132, 95, 0.25) !important;
                    color: var(--sl-color-text-accent) !important;
                    font-size: 0.7rem !important;
                    padding: 0.25rem 0.65rem !important;
                    border-radius: 20px !important;
                    font-weight: 600 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.5px !important;
                    display: inline-flex !important;
                    align-items: center !important;
                }
                .toggle-badge {
                    background-color: var(--color-lyxios-green-700) !important;
                    color: #ffffff !important;
                    border: 1px solid transparent !important;
                    cursor: pointer !important;
                    transition: all 0.2s ease !important;
                }
                .toggle-badge:hover {
                    background-color: var(--color-lyxios-green-600) !important;
                    transform: scale(1.05);
                }
                .toggle-badge.expanded {
                    background-color: var(--sl-color-gray-5) !important;
                    color: var(--sl-color-text) !important;
                }
                .staff-desc {
                    margin-top: 0.75rem !important;
                    font-size: 0.92rem !important;
                    line-height: 1.5 !important;
                }
            `}</style>

            <div style={{ marginBottom: '2rem' }}>
                <a href="/guides/demarrage/introduction/" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--color-lyxios-green-700)',
                    color: '#ffffff',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '0.9rem',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-lyxios-green-600)';
                    e.currentTarget.style.transform = 'translateX(-3px)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-lyxios-green-700)';
                    e.currentTarget.style.transform = 'none';
                }}
                >
                    <i className="fas fa-arrow-left"></i>
                    Retour à l'introduction
                </a>
            </div>

            {/* Filter and Search Bar */}
            <div className="team-filters-container">
                {/* Desktop Tabs */}
                <div className="team-tabs desktop-only">
                    {[
                        { id: 'all', label: 'Tous' },
                        { id: 'direction', label: 'Direction' },
                        { id: 'dev', label: 'Développement' },
                        { id: 'moderation', label: 'Modération' },
                        { id: 'communication', label: 'Communication' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            className={`team-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Mobile Dropdown Select */}
                <div className="mobile-only team-select-wrapper">
                    <select
                        value={activeTab}
                        onChange={(e) => setActiveTab(e.target.value)}
                        className="team-mobile-select"
                    >
                        <option value="all">Tous les rôles</option>
                        <option value="direction">Direction</option>
                        <option value="dev">Développement</option>
                        <option value="moderation">Modération</option>
                        <option value="communication">Communication</option>
                    </select>
                    <i className="fas fa-chevron-down team-select-arrow"></i>
                </div>

                <div className="team-search-wrapper">
                    <input
                        type="text"
                        placeholder="Rechercher un membre..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="team-search-input"
                    />
                    <i className="fas fa-search team-search-icon"></i>
                </div>
            </div>

            {/* Grids Rendering */}
            {activeTab === 'all' && searchQuery === '' ? (
                groupedStaff.map((group, groupIndex) => (
                    group.members.length > 0 && (
                        <div key={groupIndex}>
                            <h2 style={{ marginTop: '2rem' }}>{group.title}</h2>
                            {renderStaffGrid(group.members)}
                        </div>
                    )
                ))
            ) : (
                <div>
                    <h2 style={{ marginTop: '2rem' }}>
                        {searchQuery !== '' ? 'Résultats de la recherche' : 
                         activeTab === 'direction' ? 'Direction' :
                         activeTab === 'dev' ? 'Développement' :
                         activeTab === 'moderation' ? 'Modération & Blacklist' :
                         activeTab === 'communication' ? 'Communication & CM' : 'Membres'}
                    </h2>
                    {filteredStaffList.length > 0 ? (
                        renderStaffGrid(filteredStaffList)
                    ) : (
                        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--sl-color-bg-nav)', borderRadius: '8px' }}>
                            <p>Aucun membre ne correspond à votre recherche ou filtre.</p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}