import React, { useEffect, useMemo, useState } from "react"
import { useSortBy, useTable } from "react-table"

import "milligram/dist/milligram.min.css"

const COVID_API_URL = "https://api.coronavirus-staging.data.gov.uk/v1"

export default function Home() {
  const [locationData, setLocationData] = useState([])
  const [covidData, setCovidData] = useState([])
  const [populationData, setPopulationData] = useState({})

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Type",
        accessor: "type",
      },
      {
        Header: "New Cases",
        accessor: "cases",
      },
      {
        Header: "Population",
        accessor: "population",
      },
      {
        Header: "7-day Cases per 100,000",
        accessor: "cases100k",
      },
    ],
    []
  )

  const data = useMemo(
    () =>
      locationData.map(([id, name, type]) => ({
        id,
        name,
        type,
        cases: covidData[id],
        population: populationData[id],
        cases100k:
          Math.round((covidData[id] / (populationData[id] / 100000)) * 10) / 10,
      })),
    [covidData, locationData, populationData]
  )

  useEffect(() => {
    async function fetchLocationData() {
      const areaTypes = ["nation"/*, "region", "utla", "ltla"*/]
      const structure = ["areaCode", "areaName", "areaType"]
      const response = await fetch(
        `${COVID_API_URL}/lookup?filters=areaType=${areaTypes.join(
          "|areaType="
        )}&structure=${JSON.stringify(structure)}`
      )
      const { data } = await response.json()
      console.log("location", data)
      setLocationData(data)
    }
    fetchLocationData()
  }, [])

  useEffect(() => {
    async function fetchCovidData(offset, areaType) {
      const yesterday = new Date(
        new Date().setDate(new Date().getDate() - offset)
      )
      const date = yesterday.toISOString().substr(0, 10)
      const structure = ["areaCode", "newCasesBySpecimenDate"]
      console.log(date, areaType)
      const response = await fetch(
        `${COVID_API_URL}/data?filters=areaType=${areaType};date=${date}&structure=${JSON.stringify(
          structure
        )}`
      )
      const { data } = await response.json()
      console.log("covid", data)
      const dataObject = data.reduce(
        (accumulator, [id, cases]) => ({ ...accumulator, [id]: cases }),
        {}
      )
      setCovidData(prevData => ({
        ...prevData,
        ...data.reduce(
          (accumulator, [id, cases]) => ({ ...accumulator, [id]: (prevData[id] || 0) + cases }),
          {}
        ),
      }))
    }

    setCovidData({})
    Array(3)
      .fill()
      .forEach((_value, index) =>
        ["nation"/*, "region", "utla", "ltla"*/].forEach(areaType =>
          fetchCovidData(index + 2, areaType)
        )
      )
  }, [])

  useEffect(() => {
    async function fetchPopulation() {
      const response = await fetch(
        "https://api.beta.ons.gov.uk/v1/datasets/mid-year-pop-est/editions/mid-2019-april-2020-geography/versions/1/observations?time=2019&sex=0&age=total&geography=*"
      )
      const { observations: data } = await response.json()
      console.log("population", data)
      const dataObject = data.reduce(
        (
          accumulator,
          {
            observation: population,
            dimensions: {
              geography: { id },
            },
          }
        ) => ({
          ...accumulator,
          [id]: population,
        }),
        {}
      )
      setPopulationData(dataObject)
    }
    fetchPopulation()
  }, [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy)

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render("Header")}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? " ↓" : " ↑") : ""}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)

          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
