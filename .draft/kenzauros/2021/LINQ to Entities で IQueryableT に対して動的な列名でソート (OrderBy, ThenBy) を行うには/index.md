---
title: LINQ to Entities で IQueryable<T> に対して動的な列名でソート (OrderBy, ThenBy) を行うには
date: 2021-05-31
author: kenzauros
tags: [その他, ライフハック]
---

    /// <summary>
    /// 
    /// </summary>
    /// <seealso cref="https://stackoverflow.com/questions/2728340/how-can-i-do-an-orderby-with-a-dynamic-string-parameter"/>
    public static class IQueryableExtensions
    {
        /// <summary>
        /// Sorts the elements of a sequence according to a key and the sort order.
        /// </summary>
        /// <typeparam name="TSource">The type of the elements of <paramref name="query" />.</typeparam>
        /// <param name="query">A sequence of values to order.</param>
        /// <param name="key">Name of the property of <see cref="TSource"/> by which to sort the elements.</param>
        /// <param name="ascending">True for ascending order, false for descending order.</param>
        /// <returns>An <see cref="T:System.Linq.IOrderedQueryable`1" /> whose elements are sorted according to a key and sort order.</returns>
        public static IOrderedQueryable<TSource> OrderBy<TSource>(this IQueryable<TSource> query, string key, bool ascending = true)
        {
            var lambda = (dynamic)CreateExpression(typeof(TSource), key);
            return ascending
                ? Queryable.OrderBy(query, lambda)
                : Queryable.OrderByDescending(query, lambda);
        }

        /// <summary>
        /// Sorts the elements of a sequence according to a key and the sort order.
        /// </summary>
        /// <typeparam name="TSource">The type of the elements of <paramref name="query" />.</typeparam>
        /// <param name="query">A sequence of values to order.</param>
        /// <param name="key">Name of the property of <see cref="TSource"/> by which to sort the elements.</param>
        /// <param name="ascending">True for ascending order, false for descending order.</param>
        /// <returns>An <see cref="T:System.Linq.IOrderedQueryable`1" /> whose elements are sorted according to a key and sort order.</returns>
        public static IOrderedQueryable<TSource> ThenBy<TSource>(this IOrderedQueryable<TSource> query, string key, bool ascending = true)
        {
            var lambda = (dynamic)CreateExpression(typeof(TSource), key);
            return ascending
                ? Queryable.ThenBy(query, lambda)
                : Queryable.ThenByDescending(query, lambda);
        }

        private static LambdaExpression CreateExpression(Type type, string propertyName)
        {
            var param = Expression.Parameter(type, "x");

            Expression body = param;
            foreach (var member in propertyName.Split('.'))
            {
                body = Expression.PropertyOrField(body, member);
            }

            return Expression.Lambda(body, param);
        }
    }

            orderedQuery = query.OrderBy(columns[0], SortDirection == ListSortDirection.Ascending);
                    orderedQuery = orderedQuery.ThenBy(column, SortDirection == ListSortDirection.Ascending);
            return orderedQuery;
