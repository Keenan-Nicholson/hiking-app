import geopandas as gpd
import gpxpy
import glob
from shapely.geometry import LineString
from sqlalchemy import create_engine
import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
from geoalchemy2 import Geometry
from sqlalchemy.orm import sessionmaker
from geoalchemy2.shape import from_shape
from app import settings

Base = declarative_base()


class Tracks(Base):
    __tablename__ = "tracks"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    time = Column(String)
    geometry = Column(Geometry("LINESTRING", srid=4326))


engine = create_engine(settings.pg_dsn, echo=True)

if not sqlalchemy.inspect(engine).has_table("tracks"):
    Tracks.__table__.create(engine)

Session = sessionmaker(bind=engine)


def ingest_gpx_from_path_to_db(dir):
    path_glob = f"{dir}*.gpx"

    gpx_files = []
    for file in glob.glob(path_glob):
        gpx_file = file
        gpx_files.append(gpx_file)

    gpx_gdfs = []
    for gpx_file in gpx_files:
        gpx = gpxpy.parse(open(gpx_file))
        data = []

        for track in gpx.tracks:
            for segment in track.segments:
                points = []

                for point in segment.points:
                    points.append((point.longitude, point.latitude))

                if len(points) > 1:
                    geometry = LineString(points)
                    geometry = geometry.simplify(0.00001)
                    name = (
                        str(track.name)
                        if track.name is not None
                        else gpx_file.split("/")[-1].split(".")[0]
                    )
                    row = {
                        "name": name,
                        "time": str(point.time),
                        "geometry": geometry,
                    }
                    data.append(row)

        gpx_gdf = gpd.GeoDataFrame(
            data, columns=["name", "time", "geometry"], crs="EPSG:4326"
        )
        gpx_gdfs.append(gpx_gdf)

    for gdf in gpx_gdfs:
        gdf["geometry"] = gdf["geometry"].apply(lambda x: from_shape(x, srid=4326))

    session = Session()

    for gdf in gpx_gdfs:
        for index, row in gdf.iterrows():
            print(row["geometry"])
            track = Tracks(name=row["name"], time=row["time"], geometry=row["geometry"])
            session.add(track)

    session.commit()
