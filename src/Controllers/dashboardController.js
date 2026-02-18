const User = require('../Models/user');
const { sendResponse } = require('../utils/responseHandler');
const Denuncia = require('../Models/denuncia');
const moment = require('moment');

// ==================== ESTADÍSTICAS GENERALES ====================

exports.getUsersCount = async (req, res) => {
    try {
        const count = await User.countDocuments();
        sendResponse(res, 200, { count }, 'Número de usuarios obtenido correctamente.');
    } catch (error) {
        sendResponse(res, 500, {}, 'Error al obtener el número de usuarios.');
    }
};

exports.getDenunciasCount = async (req, res) => {
    try {
        const count = await Denuncia.countDocuments();
        sendResponse(res, 200, { count }, 'Número de denuncias obtenido correctamente.');
    } catch (error) {
        sendResponse(res, 500, {}, 'Error al obtener el número de denuncias.');
    }
};

exports.getDenunciasByStatus = async (req, res) => {
    try {
        const stats = await Denuncia.aggregate([
            {
                $group: {
                    _id: '$estado',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const formattedStats = {
            pendiente: 0,
            enProgreso: 0,
            resuelta: 0
        };

        stats.forEach(stat => {
            if (stat._id === 'Pendiente') formattedStats.pendiente = stat.count;
            else if (stat._id === 'En Progreso') formattedStats.enProgreso = stat.count;
            else if (stat._id === 'Resuelta') formattedStats.resuelta = stat.count;
        });

        sendResponse(res, 200, formattedStats, 'Denuncias por estado obtenidas correctamente.');
    } catch (error) {
        sendResponse(res, 500, {}, 'Error al obtener denuncias por estado.');
    }
};

exports.getDenunciasByCategory = async (req, res) => {
    try {
        const stats = await Denuncia.aggregate([
            {
                $group: {
                    _id: '$categoria',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        sendResponse(res, 200, stats, 'Denuncias por categoría obtenidas correctamente.');
    } catch (error) {
        sendResponse(res, 500, {}, 'Error al obtener denuncias por categoría.');
    }
};

exports.getNewDenunciasLastMonth = async (req, res) => {
    try {
        const lastMonthDate = moment().subtract(1, 'months').startOf('month');
        
        const newDenuncias = await Denuncia.find({ createdAt: { $gte: lastMonthDate } });
        
        sendResponse(res, 200, { newDenuncias }, 'Nuevas denuncias del último mes obtenidas correctamente.');
    } catch (error) {
        sendResponse(res, 500, {}, 'Error al obtener las nuevas denuncias del último mes.');
    }
};

// ==================== ESTADÍSTICAS DEL ADMIN ====================

exports.getAdminStats = async (req, res) => {
    try {
        // Total de usuarios
        const totalUsers = await User.countDocuments();

        // Denuncias totales
        const totalDenuncias = await Denuncia.countDocuments();

        // Denuncias nuevas (últimos 7 días)
        const oneWeekAgo = moment().subtract(7, 'days').toDate();
        const newDenuncias = await Denuncia.countDocuments({
            createdAt: { $gte: oneWeekAgo }
        });

        // Denuncias por estado
        const statusStats = await Denuncia.aggregate([
            {
                $group: {
                    _id: '$estado',
                    count: { $sum: 1 }
                }
            }
        ]);

        let attendedDenuncias = 0;
        statusStats.forEach(stat => {
            if (stat._id === 'Resuelta') attendedDenuncias = stat.count;
        });

        // Denuncias por categoría
        const categoryStats = await Denuncia.aggregate([
            {
                $group: {
                    _id: '$categoria',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Denuncias recientes (últimas 10)
        const recentDenuncias = await Denuncia.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('tituloDenuncia descripcion estado createdAt usuario categoria');

        // Tiempo promedio de resolución (en días)
        const resolvedDenuncias = await Denuncia.find({ estado: 'Resuelta' })
            .select('createdAt updatedAt');
        
        let avgResolutionTime = 0;
        if (resolvedDenuncias.length > 0) {
            const totalTime = resolvedDenuncias.reduce((sum, denuncia) => {
                const days = moment(denuncia.updatedAt).diff(moment(denuncia.createdAt), 'days');
                return sum + days;
            }, 0);
            avgResolutionTime = (totalTime / resolvedDenuncias.length).toFixed(1);
        }

        // Tendencia de denuncias en los últimos 15 días
        const fifteenDaysAgo = moment().subtract(15, 'days').startOf('day').toDate();
        const denunciasByDay = await Denuncia.aggregate([
            {
                $match: { createdAt: { $gte: fifteenDaysAgo } }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const stats = {
            totalUsers,
            totalDenuncias,
            newDenuncias,
            attendedDenuncias,
            avgResolutionTime,
            categories: categoryStats.map(cat => ({
                name: cat._id,
                count: cat.count,
                percentage: Math.round((cat.count / totalDenuncias) * 100)
            })),
            recentActivity: recentDenuncias.map(d => ({
                id: d._id,
                type: d.estado === 'Resuelta' ? 'atendida' : d.estado === 'En Progreso' ? 'proceso' : 'nueva',
                title: d.tituloDenuncia,
                description: d.descripcion,
                user: d.usuario,
                time: moment(d.createdAt).fromNow()
            })),
            trendData: denunciasByDay.map(d => ({
                date: d._id,
                count: d.count
            }))
        };

        sendResponse(res, 200, stats, 'Estadísticas del admin obtenidas correctamente.');
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, {}, 'Error al obtener estadísticas del admin.');
    }
};

// ==================== ESTADÍSTICAS DEL USUARIO ====================

exports.getUserDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const userFilter = {
            isDeleted: { $ne: true },
            $or: [
                { idDenunciante: userId },
                { usuario: userId }
            ]
        };

        // Denuncias del usuario
        const userDenuncias = await Denuncia.find(userFilter);
        
        const totalDenuncias = userDenuncias.length;
        let resolvedCount = 0;
        let inProgressCount = 0;
        let pendingCount = 0;

        userDenuncias.forEach(d => {
            if (d.estado === 'Resuelta' || d.estado === 'Atendida') resolvedCount++;
            else if (d.estado === 'En Progreso' || d.estado === 'En proceso') inProgressCount++;
            else if (d.estado === 'Pendiente' || d.estado === 'En revisión') pendingCount++;
        });

        // Tiempo promedio de resolución
        const resolvedUserDenuncias = userDenuncias.filter(
            d => d.estado === 'Resuelta' || d.estado === 'Atendida'
        );
        let avgResolutionTime = 0;
        if (resolvedUserDenuncias.length > 0) {
            const totalTime = resolvedUserDenuncias.reduce((sum, denuncia) => {
                const days = moment(denuncia.updatedAt).diff(moment(denuncia.createdAt), 'days');
                return sum + days;
            }, 0);
            avgResolutionTime = (totalTime / resolvedUserDenuncias.length).toFixed(1);
        }

        // Denuncias por categoría
        const categoryBreakdown = {};
        userDenuncias.forEach(d => {
            const cat = d.categoria;
            categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
        });

        // Tendencia del último mes
        const oneMonthAgo = moment().subtract(30, 'days').startOf('day').toDate();
        const denunciasByDay = await Denuncia.aggregate([
            {
                $match: {
                    ...userFilter,
                    createdAt: { $gte: oneMonthAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Denuncias recientes
        const recentDenuncias = await Denuncia.find(userFilter)
            .sort({ createdAt: -1 })
            .limit(5)
            .select('tituloDenuncia estado createdAt categoria');

        const stats = {
            totalDenuncias,
            resolvedCount,
            inProgressCount,
            pendingCount,
            avgResolutionTime,
            resolutionPercentage: totalDenuncias > 0 ? Math.round((resolvedCount / totalDenuncias) * 100) : 0,
            categories: Object.entries(categoryBreakdown).map(([name, count]) => ({
                name,
                count,
                percentage: Math.round((count / totalDenuncias) * 100)
            })),
            recentActivity: recentDenuncias.map(d => ({
                type: (d.estado === 'Resuelta' || d.estado === 'Atendida')
                    ? 'resolved'
                    : (d.estado === 'En Progreso' || d.estado === 'En proceso')
                        ? 'progress'
                        : 'new',
                title: d.tituloDenuncia,
                category: d.categoria,
                time: moment(d.createdAt).fromNow()
            })),
            trendData: denunciasByDay.map(d => ({
                date: d._id,
                count: d.count
            }))
        };

        sendResponse(res, 200, stats, 'Estadísticas del usuario obtenidas correctamente.');
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, {}, 'Error al obtener estadísticas del usuario.');
    }
};