import { useState, useEffect } from 'react';

export default function TeamList() {
    const [staffData, setStaffData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

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
        '1242861510099992690': {
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
            roles: ["Community Manager"],
            desc: "Il se consacre à accroître la visibilité de Lyxios.",
            social: []
        }
    };

    useEffect(() => {
        fetch('https://api-lyxios.xouxou-hosting.fr/api/v1/staff')
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
            "Propriétaire", "Gérant", "Développeur", "Gérant Blacklist",
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

    const groups = [
        { title: "Direction", check: (roles) => roles.includes("Propriétaire") || roles.includes("Gérant"), members: [] },
        { title: "Développement", check: (roles) => roles.includes("Développeur"), members: [] },
        { title: "Équipe", check: () => true, members: [] }
    ];

    const staffGroups = groups.map(g => ({ ...g, members: [] }));

    sortedStaff.forEach(member => {
        const info = customInfo[String(member.id)] || {};
        const roles = info.roles || [];
        for (const group of staffGroups) {
            if (group.check(roles)) {
                group.members.push(member);
                break;
            }
        }
    });

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--sl-color-bg-nav)', borderRadius: '8px', marginTop: '1rem' }}><p>Chargement de l'équipe...</p></div>;
    if (error || sortedStaff.length === 0) return <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--sl-color-bg-nav)', borderRadius: '8px', marginTop: '1rem' }}><p>Impossible de charger la liste de l'équipe pour le moment.</p></div>;

    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
            <div style={{ marginBottom: '2rem' }}>
                <a href="https://doc.lyxios.xouxou-hosting.fr/guides/demarrage/introduction/" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--color-lyxios-green-500)',
                    color: 'var(--sl-color-black)',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontWeight: 'bold'
                }}>
                    <i className="fas fa-arrow-left"></i>
                    Retour à l'introduction
                </a>
            </div>
            {staffGroups.map((group, groupIndex) => (
                group.members.length > 0 && (
                    <div key={groupIndex}>
                        <h2 style={{ marginTop: '2rem' }}>{group.title}</h2>
                        <div className="staff-grid">
                            {group.members.map((member) => {
                                const info = customInfo[String(member.id)] || {};
                                return (
                                    <div className="staff-card" key={member.id}>
                                        <div className="staff-header">
                                            <div className="staff-avatar-container">
                                                <img src={member.avatar_url} alt={member.display_name} className="staff-avatar" />
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
                                                    {info.roles.slice(0, 2).map((role, index) => <span key={index} className="staff-role-badge">{role}</span>)}
                                                    {info.roles.length > 2 && (
                                                        <details className="roles-details">
                                                            <summary>Voir plus (+{info.roles.length - 2})</summary>
                                                            <div className="roles-extra">
                                                                {info.roles.slice(2).map((role, index) => <span key={index + 2} className="staff-role-badge">{role}</span>)}
                                                            </div>
                                                        </details>
                                                    )}
                                                </div>
                                            )}
                                            {info.desc && <div className="staff-desc">{info.desc}</div>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )
            ))}
        </>
    );
}